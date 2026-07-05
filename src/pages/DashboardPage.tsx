import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, MessageSquare, Ticket, Bell, ArrowUpRight, Wallet, Route, User } from "lucide-react";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [card, setCard] = useState<{ card_number: string; balance: number; status: string } | null>(null);
  const [complaints, setComplaints] = useState<number>(0);
  const [tickets, setTickets] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: c }, { count: cc }, { count: tc }] = await Promise.all([
        supabase.from("smart_cards").select("card_number,balance,status").eq("user_id", user.id).maybeSingle(),
        supabase.from("complaints").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("tickets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      if (c) setCard(c as any);
      setComplaints(cc || 0);
      setTickets(tc || 0);
    })();
  }, [user]);

  const first = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Passenger ID · {profile?.passenger_id}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back, {first}.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <Card className="lg:col-span-2 rounded-3xl overflow-hidden border-none bg-gradient-to-br from-primary to-[hsl(210,70%,32%)] text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Smart Card</span>
              <Badge className="bg-primary-foreground/15 text-primary-foreground border-0">{card?.status ?? "Active"}</Badge>
            </div>
            <p className="font-mono tracking-[0.2em] text-lg mb-6">{card?.card_number ?? "•••• •••• •••• ••••"}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Balance</p>
                <p className="text-4xl font-bold">₹{card?.balance ?? 0}</p>
              </div>
              <Link to="/smart-card"><Button variant="secondary" className="rounded-full gap-1.5">Recharge <ArrowUpRight className="w-4 h-4" /></Button></Link>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">Quick actions</h3>
            {[
              { to: "/tickets/buy", icon: Ticket, label: "Buy QR ticket" },
              { to: "/complaints", icon: MessageSquare, label: "File complaint" },
              { to: "/journey-planner", icon: Route, label: "Plan journey" },
              { to: "/profile", icon: User, label: "Edit profile" },
            ].map(a => (
              <Link key={a.to} to={a.to} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted transition">
                <span className="flex items-center gap-2.5 text-sm font-medium"><a.icon className="w-4 h-4 text-primary" />{a.label}</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: Wallet, label: "Wallet balance", value: `₹${card?.balance ?? 0}` },
          { icon: Ticket, label: "Total tickets", value: tickets },
          { icon: MessageSquare, label: "Complaints filed", value: complaints },
        ].map(k => (
          <Card key={k.label} className="rounded-3xl">
            <CardContent className="p-6">
              <k.icon className="w-5 h-5 text-primary mb-3" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}