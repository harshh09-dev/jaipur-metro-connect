import { useState } from "react";
import { ArrowRight, IndianRupee, History, CheckCircle2, Wallet, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { rechargeAmounts, paymentMethods } from "@/data/smart-card-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useSmartCard, useTransactions, useRecharge } from "@/lib/api/hooks/useSmartCard";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { FadeIn } from "@/components/ui-kit/Motion";

type Tab = "balance" | "recharge" | "history";

export default function SmartCardPage() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { data: card, isLoading } = useSmartCard();
  const { data: transactions = [] } = useTransactions();
  const recharge = useRecharge();
  const [activeTab, setActiveTab] = useState<Tab>("balance");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [rechargeSuccess, setRechargeSuccess] = useState<{ amount: number; balance: number } | null>(null);

  const handleRecharge = async () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 10 || amount > 5000) {
      toast({ title: "Invalid amount", description: "Enter an amount between ₹10 and ₹5000", variant: "destructive" });
      return;
    }
    try {
      const updated = await recharge.mutateAsync({ amount, method: selectedMethod });
      setRechargeSuccess({ amount, balance: updated?.balance ?? 0 });
      setSelectedAmount(null);
      setCustomAmount("");
    } catch (err: any) {
      toast({ title: "Recharge failed", description: err?.message || "Please try again", variant: "destructive" });
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "balance", label: "Balance", icon: Wallet },
    { id: "recharge", label: "Recharge", icon: RefreshCw },
    { id: "history", label: "History", icon: History },
  ];

  if (isLoading || !card) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const holder = (profile?.full_name || "").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <FadeIn>
          <PageHeader
            eyebrow="Smart Card"
            title="Your JMRC transit card"
            description={`${profile?.passenger_id ?? ""} · ${holder}`}
          />
        </FadeIn>
        {/* Realistic Smart Card */}
        <FadeIn delay={0.05}>
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-6 bg-primary/20 rounded-3xl blur-2xl" />
            <div className="relative aspect-[1.586/1] bg-gradient-to-br from-[hsl(220,39%,8%)] via-secondary to-[hsl(357,45%,20%)] rounded-2xl p-6 text-white shadow-2xl border border-white/10 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/10 rounded-full" />
              <div className="relative flex items-center justify-between mb-6">
                <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-medium">JMRC Smart Card</p>
                <Badge className="bg-success/20 text-success border-success/30 text-[10px] backdrop-blur-sm">{card.status}</Badge>
              </div>
              <div className="relative w-10 h-7 bg-gradient-to-br from-warning to-warning/70 rounded-md mb-5 shadow-inner" />
              <p className="relative text-lg sm:text-xl font-mono font-bold tracking-[0.18em] mb-1">{card.card_number}</p>
              <p className="relative text-[10px] text-white/50 uppercase tracking-wider mb-5">Valid Thru {new Date(card.expiry_date).toLocaleDateString("en-IN", { month: "2-digit", year: "2-digit" })}</p>
              <div className="relative flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Card Holder</p>
                  <p className="text-sm font-semibold tracking-wide">{holder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Balance</p>
                  <p className="text-xl font-extrabold">₹ {card.balance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </FadeIn>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => { setActiveTab(tab.id); setRechargeSuccess(null); }}
                className={`gap-2 rounded-full ${activeTab === tab.id ? "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]" : ""}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Balance Tab */}
        {activeTab === "balance" && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5 text-secondary" /> Card Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-3xl font-extrabold text-foreground">₹{card.balance}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Card Status</p>
                  <Badge className="bg-success text-success-foreground mt-1">{card.status}</Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                  <p className="font-mono font-semibold text-foreground">{card.card_number}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Issued</p>
                  <p className="font-semibold text-foreground">{new Date(card.issue_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="mt-6 bg-secondary/5 border border-secondary/10 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">💡 Smart Card Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 15% discount on all metro journeys</li>
                  <li>• No queues at ticket counters</li>
                  <li>• Auto top-up facility available</li>
                  <li>• Valid across all metro lines</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recharge Tab */}
        {activeTab === "recharge" && !rechargeSuccess && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-secondary" /> Recharge Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Select Amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rechargeAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedAmount === amt
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <span className="text-xl font-bold">₹{amt}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Input
                    type="number"
                    placeholder="Custom amount (₹10 - ₹5000)"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    min={10}
                    max={5000}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMethod(m)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedMethod === m
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleRecharge} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-12 text-base">
                <IndianRupee className="w-4 h-4" /> Recharge Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recharge Success */}
        {activeTab === "recharge" && rechargeSuccess && (
          <Card className="animate-fade-in border-success/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">Recharge Successful!</h3>
              <p className="text-muted-foreground mb-6">Your smart card has been recharged.</p>
              <div className="bg-muted/50 rounded-xl p-4 max-w-xs mx-auto space-y-2 text-sm mb-6">
                <div className="flex justify-between"><span className="text-muted-foreground">Amount Added</span><span className="font-bold text-foreground">₹{rechargeSuccess.amount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">New Balance</span><span className="font-bold text-success">₹{rechargeSuccess.balance}</span></div>
              </div>
              <Button onClick={() => setRechargeSuccess(null)} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Recharge Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-secondary" /> Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No transactions yet. Recharge your card to see history here.</p>}
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "recharge" ? "bg-success/10 text-success" : tx.type === "refund" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
                      }`}>
                        {tx.type === "recharge" ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(tx.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">Bal: ₹{tx.balance_after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
