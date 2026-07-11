import { useState } from "react";
import { Link } from "react-router-dom";
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
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { FadeIn } from "@/components/ui-kit/Motion";
import { useComplaints, useCreateComplaint } from "@/lib/api/hooks/useComplaints";

const statusColors: Record<string, string> = {
  submitted: "bg-info/10 text-info border-info/20",
  under_review: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: list = [], isLoading } = useComplaints();
  const create = useCreateComplaint();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", subject: "", description: "", station: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.category || !form.subject || form.description.length < 10) {
      return toast({ title: "Missing info", description: "Category, subject and 10+ char description are required.", variant: "destructive" });
    }
    try {
      const reference = await create.mutateAsync({
        category: form.category, subject: form.subject,
        description: form.description, station: form.station || null,
      });
      toast({ title: "Complaint filed", description: `Reference: ${reference}` });
      setForm({ category: "", subject: "", description: "", station: "" });
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "Failed", description: err?.message || "Please try again", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <FadeIn>
        <PageHeader
          eyebrow="Support"
          title="Your complaints"
          description="File a concern and track its resolution end-to-end."
          actions={
            <Button onClick={() => setShowForm(v => !v)} className="rounded-full gap-1.5 bg-primary hover:bg-[hsl(var(--primary-hover))]">
              <Plus className="w-4 h-4" />New complaint
            </Button>
          }
        />
      </FadeIn>

      {showForm && (
        <FadeIn>
        <Card className="rounded-3xl mb-6 border-border/60">
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
                <Button type="submit" disabled={create.isPending} className="rounded-full bg-primary hover:bg-[hsl(var(--primary-hover))]">
                  {create.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </FadeIn>
      )}

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <Card className="rounded-3xl border-border/60">
          <EmptyState icon={MessageSquare} title="No complaints yet" description="File your first complaint to see it here." />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map(c => (
            <Link key={c.id} to={`/track-complaint?ref=${c.reference}`} className="block">
              <Card className="rounded-2xl border-border/60 hover:shadow-md hover:border-border transition">
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