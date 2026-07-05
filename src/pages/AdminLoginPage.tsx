import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) nav("/admin/dashboard", { replace: true });
    else if (!authLoading && user && !isAdmin) nav("/unauthorized", { replace: true });
  }, [authLoading, user, isAdmin, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast({ title: "Login failed", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-slate-200" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">JMRC Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Authorized personnel only</p>
        </div>
        <Card className="rounded-2xl bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5"><Label className="text-slate-300">Email</Label><Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl bg-slate-800 border-slate-700 text-slate-100" /></div>
              <div className="space-y-1.5"><Label className="text-slate-300">Password</Label><Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 rounded-xl bg-slate-800 border-slate-700 text-slate-100" /></div>
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-slate-100 text-slate-900 hover:bg-white">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-slate-500 mt-6">This is a restricted area. All access is logged.</p>
      </div>
    </div>
  );
}