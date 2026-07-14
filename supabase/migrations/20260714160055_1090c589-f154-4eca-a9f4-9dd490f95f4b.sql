
-- ============================================================
-- COMPLAINTS: workflow fields + admin policies
-- ============================================================
ALTER TABLE public.complaints
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS assigned_officer text,
  ADD COLUMN IF NOT EXISTS resolution_notes text,
  ADD COLUMN IF NOT EXISTS sla_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;

-- backfill SLA for existing rows
UPDATE public.complaints SET sla_deadline = created_at + interval '48 hours' WHERE sla_deadline IS NULL;

-- admin policies
DROP POLICY IF EXISTS "Admins can view all complaints" ON public.complaints;
CREATE POLICY "Admins can view all complaints" ON public.complaints
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all complaints" ON public.complaints;
CREATE POLICY "Admins can update all complaints" ON public.complaints
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- profiles: admin read for complaint attribution
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,   -- null = broadcast
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'system',   -- journey|payment|smart_card|complaint|announcement|security|system|promotional
  priority text NOT NULL DEFAULT 'normal',   -- low|normal|high|critical
  cta_label text,
  cta_href text,
  related_type text,
  related_id text,
  target_audience text NOT NULL DEFAULT 'individual', -- all|passengers|operators|individual
  read_at timestamptz,
  archived_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own or broadcast notifications" ON public.notifications;
CREATE POLICY "Users read own or broadcast notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (user_id IS NULL AND target_audience IN ('all','passengers'))
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own notifications" ON public.notifications;
CREATE POLICY "Users delete own notifications" ON public.notifications
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins insert any notification" ON public.notifications;
CREATE POLICY "Admins insert any notification" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON public.notifications(user_id, created_at DESC);

-- realtime
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='notifications'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
  END IF;
END $$;

-- ============================================================
-- TICKETS: extra fields
-- ============================================================
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS ticket_type text NOT NULL DEFAULT 'one_way',   -- one_way|return
  ADD COLUMN IF NOT EXISTS passengers int NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS valid_until timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'smart_card';

CREATE INDEX IF NOT EXISTS tickets_user_created_idx ON public.tickets(user_id, created_at DESC);

-- ============================================================
-- BOOK / CANCEL TICKET RPCs
-- ============================================================
CREATE OR REPLACE FUNCTION public.book_ticket(
  _from text, _to text, _fare numeric, _journey_date timestamptz,
  _ticket_type text DEFAULT 'one_way', _passengers int DEFAULT 1
) RETURNS public.tickets
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  c public.smart_cards;
  t public.tickets;
  total numeric;
  ref text;
BEGIN
  IF _passengers < 1 OR _passengers > 10 THEN RAISE EXCEPTION 'invalid passenger count'; END IF;
  IF _fare <= 0 THEN RAISE EXCEPTION 'invalid fare'; END IF;
  total := _fare * _passengers * CASE WHEN _ticket_type = 'return' THEN 2 ELSE 1 END;

  SELECT * INTO c FROM public.smart_cards WHERE user_id = auth.uid() FOR UPDATE;
  IF c.id IS NULL THEN RAISE EXCEPTION 'no smart card'; END IF;
  IF c.balance < total THEN RAISE EXCEPTION 'insufficient balance'; END IF;

  UPDATE public.smart_cards SET balance = balance - total WHERE id = c.id RETURNING * INTO c;

  ref := 'TKT-' || upper(substring(md5(random()::text) from 1 for 8));

  INSERT INTO public.tickets(user_id, reference, from_station, to_station, fare, qr_payload, status, journey_date, ticket_type, passengers, valid_until, payment_method)
  VALUES (auth.uid(), ref, _from, _to, total, ref || '|' || auth.uid()::text || '|' || extract(epoch from now())::text, 'active', _journey_date, _ticket_type, _passengers, _journey_date + interval '24 hours', 'smart_card')
  RETURNING * INTO t;

  INSERT INTO public.transactions(user_id, type, amount, balance_after, description)
  VALUES (auth.uid(), 'ticket', -total, c.balance, 'Ticket ' || ref || ' · ' || _from || ' → ' || _to);

  INSERT INTO public.notifications(user_id, title, body, category, priority, cta_label, cta_href, related_type, related_id)
  VALUES (auth.uid(), 'Ticket booked', 'Ticket ' || ref || ' from ' || _from || ' to ' || _to || ' is ready.', 'journey', 'normal', 'View ticket', '/tickets', 'ticket', t.id::text);

  RETURN t;
END; $$;

CREATE OR REPLACE FUNCTION public.cancel_ticket(_ticket_id uuid) RETURNS public.tickets
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE t public.tickets; c public.smart_cards;
BEGIN
  SELECT * INTO t FROM public.tickets WHERE id = _ticket_id AND user_id = auth.uid() FOR UPDATE;
  IF t.id IS NULL THEN RAISE EXCEPTION 'ticket not found'; END IF;
  IF t.status <> 'active' THEN RAISE EXCEPTION 'ticket not cancellable'; END IF;
  IF t.journey_date < now() THEN RAISE EXCEPTION 'journey already started'; END IF;

  UPDATE public.tickets SET status='cancelled', cancelled_at=now() WHERE id = t.id RETURNING * INTO t;
  UPDATE public.smart_cards SET balance = balance + t.fare WHERE user_id = auth.uid() RETURNING * INTO c;

  INSERT INTO public.transactions(user_id, type, amount, balance_after, description)
  VALUES (auth.uid(), 'refund', t.fare, c.balance, 'Refund for cancelled ticket ' || t.reference);

  INSERT INTO public.notifications(user_id, title, body, category, priority)
  VALUES (auth.uid(), 'Ticket cancelled', 'Ticket ' || t.reference || ' has been refunded to your smart card.', 'journey', 'normal');

  RETURN t;
END; $$;

-- ============================================================
-- COMPLAINT NOTIFICATION TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.tg_notify_complaint_insert() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications(user_id, title, body, category, priority, cta_label, cta_href, related_type, related_id)
  VALUES (NEW.user_id, 'Complaint filed', 'Reference ' || NEW.reference || ' has been received.', 'complaint', 'normal', 'Track', '/track-complaint?ref=' || NEW.reference, 'complaint', NEW.id::text);
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS complaint_notify_insert ON public.complaints;
CREATE TRIGGER complaint_notify_insert AFTER INSERT ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_complaint_insert();

CREATE OR REPLACE FUNCTION public.tg_notify_complaint_update() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications(user_id, title, body, category, priority, cta_label, cta_href, related_type, related_id)
    VALUES (NEW.user_id, 'Complaint ' || replace(NEW.status,'_',' '), 'Reference ' || NEW.reference || ' is now ' || replace(NEW.status,'_',' ') || '.',
      'complaint', CASE WHEN NEW.status='resolved' THEN 'high' ELSE 'normal' END,
      'View', '/track-complaint?ref=' || NEW.reference, 'complaint', NEW.id::text);
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS complaint_notify_update ON public.complaints;
CREATE TRIGGER complaint_notify_update AFTER UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_complaint_update();

-- updated_at trigger for complaints (guarantee)
DROP TRIGGER IF EXISTS complaints_set_updated_at ON public.complaints;
CREATE TRIGGER complaints_set_updated_at BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- SMART CARD RECHARGE NOTIFICATION
-- ============================================================
CREATE OR REPLACE FUNCTION public.tg_notify_recharge() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.type = 'recharge' THEN
    INSERT INTO public.notifications(user_id, title, body, category, priority, cta_label, cta_href)
    VALUES (NEW.user_id, 'Recharge successful', '₹' || NEW.amount || ' added. New balance ₹' || NEW.balance_after || '.', 'smart_card', 'normal', 'View card', '/smart-card');
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS transactions_notify_recharge ON public.transactions;
CREATE TRIGGER transactions_notify_recharge AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_recharge();

-- ============================================================
-- GRANT ADMIN ROLE
-- ============================================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = lower('anjalikamal3105@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
