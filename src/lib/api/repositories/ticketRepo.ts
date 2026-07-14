import { supabase } from "@/integrations/supabase/client";

export interface TicketRow {
  id: string;
  reference: string;
  from_station: string;
  to_station: string;
  fare: number;
  qr_payload: string;
  status: string;
  journey_date: string;
  created_at: string;
  ticket_type: string;
  passengers: number;
  valid_until: string | null;
  cancelled_at: string | null;
  payment_method: string;
}

export const ticketRepo = {
  async list(userId: string): Promise<TicketRow[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as TicketRow[]) || [];
  },
  async book(input: { from: string; to: string; fare: number; journey_date: string; ticket_type: "one_way" | "return"; passengers: number }) {
    const { data, error } = await supabase.rpc("book_ticket", {
      _from: input.from, _to: input.to, _fare: input.fare,
      _journey_date: input.journey_date, _ticket_type: input.ticket_type, _passengers: input.passengers,
    });
    if (error) throw error;
    return data as unknown as TicketRow;
  },
  async cancel(ticketId: string) {
    const { data, error } = await supabase.rpc("cancel_ticket", { _ticket_id: ticketId });
    if (error) throw error;
    return data as unknown as TicketRow;
  },
};