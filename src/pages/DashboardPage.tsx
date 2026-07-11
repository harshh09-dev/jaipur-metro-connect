import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Ticket, ArrowUpRight, Wallet, Route, User } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { StatCard } from "@/components/ui-kit/StatCard";
import { FadeIn } from "@/components/ui-kit/Motion";
import { useSmartCard } from "@/lib/api/hooks/useSmartCard";
import { useComplaints } from "@/lib/api/hooks/useComplaints";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data: card } = useSmartCard();
  const { data: complaintsList } = useComplaints();

  const first = profile?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <FadeIn>
        <PageHeader
          eyebrow={`Passenger · ${profile?.passenger_id ?? ""}`}
          title={`${greet}, ${first}.`}
          description="Here's a snapshot of your smart card, journeys and support tickets."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2 rounded-3xl overflow-hidden border-none bg-gradient-to-br from-secondary via-[hsl(220,39%,15%)] to-[hsl(357,60%,25%)] text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">JMRC Smart Card</span>
              <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">{card?.status ?? "Active"}</Badge>
            </div>
            <p className="font-mono tracking-[0.2em] text-lg mb-6">{card?.card_number ?? "•••• •••• •••• ••••"}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider">Balance</p>
                <p className="text-4xl font-bold">₹{card?.balance ?? 0}</p>
              </div>
              <Link to="/smart-card"><Button className="rounded-full gap-1.5 bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]">Recharge <ArrowUpRight className="w-4 h-4" /></Button></Link>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/60">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Quick actions</h3>
            {[
              { to: "/journey-planner", icon: Ticket, label: "Buy QR ticket" },
              { to: "/complaints", icon: MessageSquare, label: "File complaint" },
              { to: "/journey-planner", icon: Route, label: "Plan journey" },
              { to: "/profile", icon: User, label: "Edit profile" },
            ].map(a => (
              <Link key={a.to + a.label} to={a.to} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted transition">
                <span className="flex items-center gap-2.5 text-sm font-medium"><a.icon className="w-4 h-4 text-primary" />{a.label}</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={Wallet} label="Wallet balance" value={`₹${card?.balance ?? 0}`} />
          <StatCard icon={Ticket} label="Total tickets" value={0} />
          <StatCard icon={MessageSquare} label="Complaints filed" value={complaintsList?.length ?? 0} />
        </div>
      </FadeIn>
    </div>
  );
}