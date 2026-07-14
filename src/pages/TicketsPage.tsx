import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket, Plus, ArrowRight, Loader2, MapPin, Clock, Users, Wallet,
  Download, Share2, X, CheckCircle2, AlertTriangle, IndianRupee, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { FadeIn } from "@/components/ui-kit/Motion";
import { useTickets, useBookTicket, useCancelTicket } from "@/lib/api/hooks/useTickets";
import { useSmartCard, useRecharge } from "@/lib/api/hooks/useSmartCard";
import { allStations, calculateFare } from "@/data/metro-data";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { TicketRow } from "@/lib/api/repositories/ticketRepo";
import { cn } from "@/lib/utils";

const tabs = ["upcoming", "active", "completed", "cancelled"] as const;
type Tab = typeof tabs[number];

function ticketBucket(t: TicketRow): Tab {
  if (t.status === "cancelled") return "cancelled";
  const journey = new Date(t.journey_date);
  const valid = t.valid_until ? new Date(t.valid_until) : new Date(+journey + 24 * 3600 * 1000);
  const now = new Date();
  if (now < journey) return "upcoming";
  if (now <= valid && t.status === "active") return "active";
  return "completed";
}

export default function TicketsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { data: tickets = [], isLoading } = useTickets();
  const { data: card } = useSmartCard();
  const book = useBookTicket();
  const cancel = useCancelTicket();
  const recharge = useRecharge();

  const [tab, setTab] = useState<Tab>("upcoming");
  const [q, setQ] = useState("");
  const [showBook, setShowBook] = useState(false);
  const [detail, setDetail] = useState<TicketRow | null>(null);
  const [success, setSuccess] = useState<TicketRow | null>(null);

  const [form, setForm] = useState({
    from: "", to: "", ticket_type: "one_way" as "one_way" | "return", passengers: 1,
    journey_date: new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16),
  });
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmt, setRechargeAmt] = useState(200);

  const grouped = useMemo(() => {
    const map: Record<Tab, TicketRow[]> = { upcoming: [], active: [], completed: [], cancelled: [] };
    tickets.forEach((t) => map[ticketBucket(t)].push(t));
    return map;
  }, [tickets]);

  const list = useMemo(() => {
    return grouped[tab].filter((t) => !q ||
      `${t.reference} ${t.from_station} ${t.to_station}`.toLowerCase().includes(q.toLowerCase()));
  }, [grouped, tab, q]);

  const fromStation = allStations.find((s) => s.name === form.from);
  const toStation = allStations.find((s) => s.name === form.to);
  const quote = fromStation && toStation && fromStation.name !== toStation.name ? calculateFare(fromStation, toStation) : null;
  const totalFare = quote ? quote.fare * form.passengers * (form.ticket_type === "return" ? 2 : 1) : 0;
  const balance = card?.balance ?? 0;
  const insufficient = quote && totalFare > balance;

  const doBook = async () => {
    if (!quote) return;
    try {
      const t = await book.mutateAsync({
        from: form.from, to: form.to, fare: quote.fare,
        journey_date: new Date(form.journey_date).toISOString(),
        ticket_type: form.ticket_type, passengers: form.passengers,
      });
      setShowBook(false);
      setSuccess(t);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Please try again";
      if (msg.toLowerCase().includes("insufficient")) setShowRecharge(true);
      else toast({ title: "Booking failed", description: msg, variant: "destructive" });
    }
  };

  const doRechargeThenBook = async () => {
    if (rechargeAmt < 10) return;
    try {
      await recharge.mutateAsync({ amount: rechargeAmt, method: "UPI" });
      setShowRecharge(false);
      await doBook();
    } catch (e: unknown) {
      toast({ title: "Recharge failed", description: e instanceof Error ? e.message : "Please try again", variant: "destructive" });
    }
  };

  const share = async (t: TicketRow) => {
    const text = `JMRC ticket ${t.reference}: ${t.from_station} → ${t.to_station}`;
    if (navigator.share) { try { await navigator.share({ title: "JMRC Ticket", text }); } catch { /* ignore */ } }
    else { await navigator.clipboard.writeText(text); toast({ title: "Copied to clipboard" }); }
  };

  const download = (t: TicketRow) => {
    const svg = document.getElementById(`qr-${t.id}`);
    if (!svg) return;
    const s = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([s], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${t.reference}.svg`; a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (t: TicketRow) => {
    const b = ticketBucket(t);
    const map: Record<Tab, string> = {
      upcoming: "bg-accent/10 text-accent border-accent/20",
      active: "bg-success/10 text-success border-success/20",
      completed: "bg-muted text-muted-foreground border-border",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return <Badge className={cn("capitalize text-[10px]", map[b])}>{b}</Badge>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <FadeIn>
        <PageHeader
          eyebrow="Tickets"
          title="Your metro tickets"
          description="Book QR tickets, review journey history and manage payments."
          actions={
            <Button onClick={() => setShowBook(true)} className="rounded-full gap-1.5 bg-primary hover:bg-[hsl(var(--primary-hover))]">
              <Plus className="w-4 h-4" />Book ticket
            </Button>
          }
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {tabs.map((t) => (
            <SoftCard key={t} className={cn("p-4 cursor-pointer transition", tab === t ? "border-primary/40 shadow-md" : "hover:border-border")} >
              <button onClick={() => setTab(t)} className="w-full text-left">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{t}</p>
                <p className="text-2xl font-bold mt-1">{grouped[t].length}</p>
              </button>
            </SoftCard>
          ))}
        </div>
      </FadeIn>

      <SoftCard className="p-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by station or reference"
            className="pl-9 h-10 rounded-xl bg-muted/40 border-transparent" />
        </div>
      </SoftCard>

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <SoftCard>
          <EmptyState icon={Ticket} title={`No ${tab} tickets`}
            description={tab === "upcoming" ? "Book your first metro journey to see it here." : "Nothing to show yet."} />
        </SoftCard>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <FadeIn key={t.id}>
              <SoftCard className="p-5 hover:shadow-md transition cursor-pointer" >
                <button className="w-full text-left" onClick={() => setDetail(t)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[11px] text-muted-foreground">{t.reference}</span>
                        {statusBadge(t)}
                        <Badge variant="outline" className="capitalize text-[10px]">{t.ticket_type.replace("_", " ")}</Badge>
                        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Users className="w-3 h-3" />{t.passengers}</span>
                      </div>
                      <p className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                        <span className="truncate">{t.from_station}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{t.to_station}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(t.journey_date).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold">₹{Number(t.fare).toFixed(0)}</p>
                      <p className="text-[10px] text-muted-foreground">Smart card</p>
                    </div>
                  </div>
                </button>
              </SoftCard>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Booking dialog */}
      <Dialog open={showBook} onOpenChange={setShowBook}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader><DialogTitle>Book a metro ticket</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Select value={form.from} onValueChange={(v) => setForm({ ...form, from: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Origin" /></SelectTrigger>
                  <SelectContent>{allStations.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Destination" /></SelectTrigger>
                  <SelectContent>{allStations.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <Label>Type</Label>
                <Select value={form.ticket_type} onValueChange={(v) => setForm({ ...form, ticket_type: v as "one_way" | "return" })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="one_way">One way</SelectItem><SelectItem value="return">Return</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Passengers</Label>
                <Input type="number" min={1} max={10} value={form.passengers}
                  onChange={(e) => setForm({ ...form, passengers: Math.max(1, Math.min(10, +e.target.value || 1)) })}
                  className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>When</Label>
                <Input type="datetime-local" value={form.journey_date}
                  onChange={(e) => setForm({ ...form, journey_date: e.target.value })} className="rounded-xl h-11" />
              </div>
            </div>

            {quote && (
              <SoftCard className="p-4 bg-muted/40 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Stations</span>
                  <span className="font-semibold">{quote.stations}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Travel time</span>
                  <span className="font-semibold">≈ {quote.time} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />Card balance</span>
                  <span className={cn("font-semibold", insufficient && "text-destructive")}>₹{balance}</span>
                </div>
                <div className="border-t border-border/60 pt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-extrabold text-primary">₹{totalFare}</span>
                </div>
                {insufficient && (
                  <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/5 rounded-lg p-2 border border-destructive/15">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Balance is short by ₹{totalFare - balance}. Recharge and continue in one step.</span>
                  </div>
                )}
              </SoftCard>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" className="rounded-full" onClick={() => setShowBook(false)}>Cancel</Button>
              {insufficient ? (
                <Button className="rounded-full bg-primary hover:bg-[hsl(var(--primary-hover))]" onClick={() => setShowRecharge(true)}>
                  <Wallet className="w-4 h-4 mr-1.5" />Recharge & book
                </Button>
              ) : (
                <Button className="rounded-full bg-primary hover:bg-[hsl(var(--primary-hover))]"
                  onClick={doBook} disabled={!quote || book.isPending}>
                  {book.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm ₹{totalFare}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recharge dialog */}
      <Dialog open={showRecharge} onOpenChange={setShowRecharge}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader><DialogTitle>Recharge smart card</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Top up your card and we'll continue with the ticket booking.</p>
            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((a) => (
                <button key={a} onClick={() => setRechargeAmt(a)}
                  className={cn("p-3 rounded-xl border text-sm font-semibold transition",
                    rechargeAmt === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}>
                  ₹{a}
                </button>
              ))}
            </div>
            <Input type="number" min={10} value={rechargeAmt} onChange={(e) => setRechargeAmt(+e.target.value || 0)} className="rounded-xl h-11" />
            <Button onClick={doRechargeThenBook} disabled={recharge.isPending || book.isPending}
              className="w-full h-11 rounded-full bg-primary hover:bg-[hsl(var(--primary-hover))]">
              {(recharge.isPending || book.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <IndianRupee className="w-4 h-4 mr-1" />Recharge & continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success screen */}
      <Dialog open={!!success} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          {success && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ticket booked</h3>
                <p className="text-sm text-muted-foreground">Scan the QR at any AFC gate.</p>
              </div>
              <SoftCard className="p-5 mx-auto w-fit">
                <QRCodeSVG id={`qr-${success.id}`} value={success.qr_payload} size={180} level="M" />
              </SoftCard>
              <div className="text-sm">
                <p className="font-mono text-xs text-muted-foreground">{success.reference}</p>
                <p className="font-semibold mt-1">{success.from_station} → {success.to_station}</p>
                <p className="text-xs text-muted-foreground">{profile?.full_name}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" className="rounded-full" onClick={() => download(success)}><Download className="w-4 h-4 mr-1.5" />Download</Button>
                <Button variant="outline" className="rounded-full" onClick={() => share(success)}><Share2 className="w-4 h-4 mr-1.5" />Share</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail view */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          {detail && (
            <div className="space-y-4">
              <DialogHeader><DialogTitle>Ticket {detail.reference}</DialogTitle></DialogHeader>
              <div className="flex justify-center">
                <SoftCard className="p-4">
                  <QRCodeSVG id={`qr-${detail.id}`} value={detail.qr_payload} size={180} level="M" />
                </SoftCard>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">From</span><span className="font-semibold">{detail.from_station}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">To</span><span className="font-semibold">{detail.to_station}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Passengers</span><span className="font-semibold">{detail.passengers}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-semibold capitalize">{detail.ticket_type.replace("_", " ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fare</span><span className="font-semibold">₹{Number(detail.fare).toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Journey</span><span className="font-semibold">{new Date(detail.journey_date).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span>{statusBadge(detail)}</div>
              </div>
              <div className="pt-2 rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground text-sm">Travel instructions</p>
                <p>• Scan the QR at the entry AFC gate. It must be scanned again at exit.</p>
                <p>• Ticket is valid for 24 hours from journey time.</p>
                <p>• Please carry a valid photo ID for verification.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="rounded-full" onClick={() => download(detail)}><Download className="w-4 h-4 mr-1.5" />Download</Button>
                <Button variant="outline" className="rounded-full" onClick={() => share(detail)}><Share2 className="w-4 h-4 mr-1.5" />Share</Button>
                {ticketBucket(detail) === "upcoming" && (
                  <Button variant="destructive" className="rounded-full"
                    onClick={async () => {
                      try { await cancel.mutateAsync(detail.id); toast({ title: "Ticket cancelled", description: "Refunded to your smart card." }); setDetail(null); }
                      catch (e: unknown) { toast({ title: "Cancel failed", description: e instanceof Error ? e.message : "Try again", variant: "destructive" }); }
                    }}>
                    <X className="w-4 h-4 mr-1.5" />Cancel ticket
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}