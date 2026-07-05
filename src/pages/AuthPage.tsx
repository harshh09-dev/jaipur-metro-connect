import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Train, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

type Mode = "login" | "register";

export default function AuthPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    full_name: "", phone: "", dob: "", gender: "", address: "",
    city: "Jaipur", state: "Rajasthan", pincode: "", gov_id: "", emergency_contact: "",
  });

  useEffect(() => {
    if (!authLoading && user) nav(next, { replace: true });
  }, [authLoading, user, next, nav]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast({ title: "Login failed", description: error.message, variant: "destructive" });
    toast({ title: "Welcome back!" });
    nav(next, { replace: true });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.address || !form.pincode) {
      return toast({ title: "Missing information", description: "Fill all required fields", variant: "destructive" });
    }
    if (password.length < 6) return toast({ title: "Weak password", description: "At least 6 characters", variant: "destructive" });
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}${next}`, data: form },
    });
    setLoading(false);
    if (error) return toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    toast({ title: "Account created", description: "Welcome to JMRC Connect!" });
    nav(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center"><Train className="w-5 h-5 text-primary-foreground" /></div>
            <span className="font-bold text-xl">JMRC <span className="text-primary">Connect</span></span>
          </Link>
          <h1 className="text-5xl font-bold tracking-tight leading-[1.05] mb-6">Smart mobility<br />for every journey.</h1>
          <p className="text-lg text-muted-foreground max-w-md">Recharge your smart card, buy QR tickets, file complaints and track them — all from one signed-in account.</p>
          <div className="mt-10 space-y-3 text-sm">
            {["One tap smart-card recharge", "Personal ticket & journey history", "Track complaints in real time"].map(f => (
              <div key={f} className="flex items-center gap-2 text-foreground/80"><ArrowRight className="w-4 h-4 text-primary" />{f}</div>
            ))}
          </div>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
          <CardContent className="p-8">
            <div className="flex gap-1 p-1 bg-muted rounded-full mb-6 w-fit">
              {(["login", "register"] as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-5 py-1.5 text-sm font-medium rounded-full transition ${mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl" /></div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="h-11 rounded-xl" /></div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Sign in
                </Button>
                <p className="text-xs text-muted-foreground text-center">New here? <button type="button" onClick={() => setMode("register")} className="text-primary font-medium">Create an account</button></p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <h2 className="text-2xl font-bold">Create your account</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5"><Label>Full name *</Label><Input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Email *</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Phone *</Label><Input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Password *</Label><Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>DOB</Label><Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                      <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>PIN Code *</Label><Input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="col-span-2 space-y-1.5"><Label>Address *</Label><Input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>State</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Gov ID</Label><Input value={form.gov_id} onChange={e => setForm({ ...form, gov_id: e.target.value })} placeholder="Aadhaar / PAN (optional)" className="h-10 rounded-xl" /></div>
                  <div className="space-y-1.5"><Label>Emergency contact</Label><Input value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} className="h-10 rounded-xl" /></div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl mt-3">
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Create account
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">By continuing you agree to JMRC's terms & privacy policy.</p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}