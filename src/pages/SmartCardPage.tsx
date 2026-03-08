import { useState } from "react";
import { CreditCard, ArrowRight, IndianRupee, History, CheckCircle2, Wallet, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getSmartCard, getTransactions, rechargeCard, rechargeAmounts, paymentMethods, type SmartCard, type Transaction } from "@/data/smart-card-data";
import { useToast } from "@/hooks/use-toast";

type Tab = "balance" | "recharge" | "history";

export default function SmartCardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("balance");
  const [card, setCard] = useState<SmartCard>(getSmartCard);
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [rechargeSuccess, setRechargeSuccess] = useState<{ amount: number; txId: string; balance: number } | null>(null);

  const handleRecharge = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 10 || amount > 5000) {
      toast({ title: "Invalid amount", description: "Enter an amount between ₹10 and ₹5000", variant: "destructive" });
      return;
    }
    const result = rechargeCard(amount, selectedMethod);
    setCard(result.card);
    setTransactions(getTransactions());
    setRechargeSuccess({ amount, txId: result.transaction.id, balance: result.card.balance });
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "balance", label: "Balance", icon: Wallet },
    { id: "recharge", label: "Recharge", icon: RefreshCw },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="metro-gradient text-primary-foreground py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Smart Card Services</h1>
          <p className="text-primary-foreground/70 text-lg">Check balance, recharge your card, and view transaction history.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card Visual */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-br from-primary via-primary to-secondary/80 rounded-2xl p-6 sm:p-8 text-primary-foreground max-w-md mx-auto shadow-xl">
            <div className="absolute top-4 right-4">
              <CreditCard className="w-8 h-8 text-primary-foreground/30" />
            </div>
            <p className="text-xs text-primary-foreground/50 uppercase tracking-widest mb-1">JMRC Smart Card</p>
            <p className="text-xl sm:text-2xl font-mono font-bold tracking-wider mb-4">{card.cardNumber}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-primary-foreground/50 mb-0.5">Card Holder</p>
                <p className="text-sm font-semibold">{card.holderName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary-foreground/50 mb-0.5">Balance</p>
                <p className="text-2xl font-extrabold">₹{card.balance}</p>
              </div>
            </div>
            <Badge className="absolute bottom-4 right-4 bg-success/20 text-success border-success/30 text-[10px]">{card.status}</Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => { setActiveTab(tab.id); setRechargeSuccess(null); }}
                className="gap-2"
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
                  <p className="font-mono font-semibold text-foreground">{card.cardNumber}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Last Recharge</p>
                  <p className="font-semibold text-foreground">{new Date(card.lastRecharge).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
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
                <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs text-foreground">{rechargeSuccess.txId}</span></div>
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
                          {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(tx.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">Bal: ₹{tx.balanceAfter}</p>
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
