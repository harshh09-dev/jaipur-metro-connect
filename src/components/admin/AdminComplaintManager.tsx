import { useMemo, useState } from "react";
import {
  Search, Loader2, MessageSquare, UserCircle2, Clock, AlertTriangle,
  CheckCircle2, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { FadeIn } from "@/components/ui-kit/Motion";
import { useAdminComplaints, useUpdateComplaint } from "@/lib/api/hooks/useAdminComplaints";
import type { AdminComplaintRow } from "@/lib/api/repositories/adminComplaintRepo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  submitted: "bg-accent/10 text-accent border-accent/20",
  under_review: "bg-warning/10 text-warning border-warning/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  closed: "bg-muted text-muted-foreground border-border",
};

const statuses = ["submitted", "under_review", "in_progress", "resolved", "rejected", "closed"];
const priorities = ["low", "medium", "high", "critical"];

export function AdminComplaintManager() {
  const { data: items = [], isLoading } = useAdminComplaints();
  const update = useUpdateComplaint();
  const { toast } = useToast();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [detail, setDetail] = useState<AdminComplaintRow | null>(null);
  const [officer, setOfficer] = useState("");
  const [response, setResponse] = useState("");
  const [resolution, setResolution] = useState("");
  const [nextStatus, setNextStatus] = useState<string>("submitted");
  const [nextPriority, setNextPriority] = useState<string>("medium");

  const openDetail = (c: AdminComplaintRow) => {
    setDetail(c);
    setOfficer(c.assigned_officer ?? "");
    setResponse(c.admin_response ?? "");
    setResolution(c.resolution_notes ?? "");
    setNextStatus(c.status);
    setNextPriority(c.priority);
  };

  const save = async () => {
    if (!detail) return;
    try {
      await update.mutateAsync({
        id: detail.id,
        patch: {
          assigned_officer: officer || null,
          admin_response: response || null,
          resolution_notes: resolution || null,
          status: nextStatus,
          priority: nextPriority,
        },
      });
      toast({ title: "Complaint updated", description: `${detail.reference} → ${nextStatus.replace("_", " ")}` });
      setDetail(null);
    } catch (e: unknown) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : "Try again", variant: "destructive" });
    }
  };

  const filtered = useMemo(() => items.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
    if (q && !`${c.reference} ${c.subject} ${c.station ?? ""} ${c.profiles?.full_name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [items, q, statusFilter, priorityFilter]);

  const kpis = useMemo(() => {
    const total = items.length;
    const open = items.filter((c) => !["resolved", "closed"].includes(c.status)).length;
    const overdue = items.filter((c) => c.sla_deadline && new Date(c.sla_deadline) < new Date() && !["resolved", "closed"].includes(c.status)).length;
    const resolved = items.filter((c) => c.status === "resolved" || c.status === "closed").length;
    return { total, open, overdue, resolved };
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: kpis.total, icon: MessageSquare, cls: "text-foreground" },
          { label: "Open", value: kpis.open, icon: Clock, cls: "text-warning" },
          { label: "Overdue", value: kpis.overdue, icon: AlertTriangle, cls: "text-destructive" },
          { label: "Resolved", value: kpis.resolved, icon: CheckCircle2, cls: "text-success" },
        ].map((k) => (
          <SoftCard key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{k.label}</p>
                <p className={cn("text-2xl font-bold mt-1", k.cls)}>{k.value}</p>
              </div>
              <k.icon className={cn("w-5 h-5", k.cls)} />
            </div>
          </SoftCard>
        ))}
      </div>

      <SoftCard className="p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search reference, subject, passenger or station" value={q} onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-muted/40 border-transparent" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {priorities.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </SoftCard>

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <SoftCard><EmptyState icon={MessageSquare} title="No complaints" description="Nothing matches these filters yet." /></SoftCard>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const overdue = c.sla_deadline && new Date(c.sla_deadline) < new Date() && !["resolved", "closed"].includes(c.status);
            return (
              <FadeIn key={c.id}>
                <SoftCard className={cn("p-4 hover:shadow-md transition cursor-pointer", overdue && "border-destructive/30")}>
                  <button className="w-full text-left" onClick={() => openDetail(c)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-mono text-[11px] text-muted-foreground">{c.reference}</span>
                          <Badge className={cn("capitalize text-[10px]", statusStyle[c.status])}>{c.status.replace("_", " ")}</Badge>
                          <Badge variant="outline" className="capitalize text-[10px]">{c.priority}</Badge>
                          <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                          {overdue && <Badge variant="destructive" className="text-[10px]">SLA breach</Badge>}
                        </div>
                        <p className="font-semibold text-sm truncate">{c.subject}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {c.profiles?.full_name ?? "Passenger"} · {c.station ?? "—"} · {new Date(c.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                      {c.assigned_officer && (
                        <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                          <UserCircle2 className="w-3.5 h-3.5" />{c.assigned_officer}
                        </div>
                      )}
                    </div>
                  </button>
                </SoftCard>
              </FadeIn>
            );
          })}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="rounded-3xl max-w-2xl">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="font-mono text-xs text-muted-foreground block mb-1">{detail.reference}</span>
                  {detail.subject}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <SoftCard className="p-3 bg-muted/40 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-muted-foreground">Passenger</span><p className="font-semibold">{detail.profiles?.full_name ?? "—"}</p></div>
                    <div><span className="text-muted-foreground">Contact</span><p className="font-semibold">{detail.profiles?.phone ?? detail.profiles?.email ?? "—"}</p></div>
                    <div><span className="text-muted-foreground">Station</span><p className="font-semibold">{detail.station ?? "—"}</p></div>
                    <div><span className="text-muted-foreground">Category</span><p className="font-semibold">{detail.category}</p></div>
                    <div><span className="text-muted-foreground">Filed</span><p className="font-semibold">{new Date(detail.created_at).toLocaleString("en-IN")}</p></div>
                    <div><span className="text-muted-foreground">SLA</span><p className={cn("font-semibold", detail.sla_deadline && new Date(detail.sla_deadline) < new Date() && "text-destructive")}>
                      {detail.sla_deadline ? new Date(detail.sla_deadline).toLocaleString("en-IN") : "—"}</p></div>
                  </div>
                </SoftCard>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-xl leading-relaxed">{detail.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={nextStatus} onValueChange={setNextStatus}>
                      <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Priority</Label>
                    <Select value={nextPriority} onValueChange={setNextPriority}>
                      <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>{priorities.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Assigned officer</Label>
                  <Input value={officer} onChange={(e) => setOfficer(e.target.value)} placeholder="e.g. Insp. R. Sharma" className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Response to passenger</Label>
                  <Textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={3} className="rounded-xl"
                    placeholder="This message appears in the passenger's tracking view." />
                </div>
                <div className="space-y-1.5">
                  <Label>Internal resolution notes</Label>
                  <Textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={2} className="rounded-xl"
                    placeholder="Root cause, corrective action, owner. Not shown to passenger." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="rounded-full" onClick={() => setDetail(null)}>Close</Button>
                  <Button className="rounded-full bg-primary hover:bg-[hsl(var(--primary-hover))]" onClick={save} disabled={update.isPending}>
                    {update.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save changes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}