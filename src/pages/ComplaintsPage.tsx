import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus, Loader2, ArrowUpRight } from "lucide-react";
import { allStations, complaintCategories } from "@/data/metro-data";

interface Complaint {
  id: string; reference: string; category: string; subject: string; description: string;
  station: string | null; status: string; admin_response: string | null; created_at: string;
}

const statusColors: Record<string, string> = {
  submitted: "bg-info/10 text-info border-info/20",
  under_review: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [list, setList] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", subject: "", description: "", station: "" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("complaints").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setList((data as Complaint[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.subject || form.description.length < 10) {
      return toast({ title: "Missing info", description: "Category, subject and 10+ char description are required.", variant: "destructive" });
    }
    setCreating(true);
    const reference = "JMRC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const { error } = await supabase.from("complaints").insert({
      user_id: user!.id, reference,
      category: form.category, subject: form.subject, description: form.description, station: form.station || null,
    });
    setCreating(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Complaint filed", description: `Reference: ${reference}` });
    setForm({ category: "", subject: "", description: "", station: "" });
    setShowForm(false);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your complaints</h1>
          <p className="text-muted-foreground mt-1">File and track feedback with JMRC.</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)} className="rounded-full gap-1.5"><Plus className="w-4 h-4" />New complaint</Button>
      </div>

      {showForm && (
        <Card className="rounded-3xl mb-6">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{complaintCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Station</Label>
                  <Select value={form.station} onValueChange={v => setForm({ ...form, station: v })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>{allStations.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Subject *</Label><Input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="rounded-xl h-11" /></div>
              <div className="space-y-1.5"><Label>Description *</Label><Textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl" /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={creating} className="rounded-full">{creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No complaints yet</p>
            <p className="text-sm text-muted-foreground">File your first complaint to see it here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map(c => (
            <Link key={c.id} to={`/track-complaint?ref=${c.reference}`} className="block">
              <Card className="rounded-2xl hover:shadow-md transition">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{c.reference}</span>
                      <Badge className={statusColors[c.status] || ""}>{c.status.replace("_", " ")}</Badge>
                      <Badge variant="outline" className="text-xs">{c.category}</Badge>
                    </div>
                    <p className="font-semibold truncate">{c.subject}</p>
                    <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString("en-IN")}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}