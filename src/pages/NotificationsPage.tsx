import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, CreditCard, MessageSquare, Route as RouteIcon, ShieldCheck, Megaphone,
  CheckCheck, Archive, Trash2, Search, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { FadeIn } from "@/components/ui-kit/Motion";
import {
  useNotifications, useMarkAllRead, useMarkRead,
  useArchiveNotification, useDeleteNotification,
} from "@/lib/api/hooks/useNotifications";
import type { NotificationRow } from "@/lib/api/repositories/notificationRepo";
import { cn } from "@/lib/utils";

const catIcon: Record<string, React.ElementType> = {
  journey: RouteIcon, smart_card: CreditCard, payment: CreditCard,
  complaint: MessageSquare, announcement: Megaphone, security: ShieldCheck,
  system: Bell, promotional: Sparkles,
};

const priorityStyle: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  normal: "bg-accent/10 text-accent border-accent/20",
  low: "bg-muted text-muted-foreground border-border",
};

function bucket(iso: string) {
  const d = new Date(iso); const now = new Date();
  const days = Math.floor((+now - +d) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Earlier this week";
  return "Earlier";
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - +new Date(iso)) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60); if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24); return `${d}d`;
}

export default function NotificationsPage() {
  const { data: items = [], isLoading } = useNotifications();
  const markAll = useMarkAllRead();
  const markRead = useMarkRead();
  const archive = useArchiveNotification();
  const remove = useDeleteNotification();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = ["all", "journey", "smart_card", "complaint", "payment", "announcement", "security", "system"];

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (tab === "unread" && n.read_at) return false;
      if (cat !== "all" && n.category !== cat) return false;
      if (q && !`${n.title} ${n.body ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, tab, cat, q]);

  const grouped = useMemo(() => {
    const g: Record<string, NotificationRow[]> = {};
    filtered.forEach((n) => { const b = bucket(n.created_at); (g[b] ||= []).push(n); });
    return g;
  }, [filtered]);

  const unread = items.filter((n) => !n.read_at).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <FadeIn>
        <PageHeader
          eyebrow="Inbox"
          title="Notifications"
          description="Journey updates, smart card activity, complaint responses and JMRC announcements."
          actions={
            <Button variant="outline" className="rounded-full" onClick={() => markAll.mutate()} disabled={!unread}>
              <CheckCheck className="w-4 h-4 mr-1.5" />Mark all read
            </Button>
          }
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <SoftCard className="p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div className="flex gap-1 p-1 bg-muted rounded-full w-fit">
              {(["all", "unread"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn("px-4 py-1.5 text-xs font-medium rounded-full transition capitalize",
                    tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
                  {t}{t === "unread" && unread ? ` · ${unread}` : ""}
                </button>
              ))}
            </div>
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="pl-9 h-9 rounded-xl bg-muted/40 border-transparent" />
            </div>
          </div>
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={cn("text-[11px] px-2.5 py-1 rounded-full font-medium capitalize border transition",
                  cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/40")}>
                {c.replace("_", " ")}
              </button>
            ))}
          </div>
        </SoftCard>
      </FadeIn>

      {isLoading ? (
        <SoftCard className="p-10 text-center text-muted-foreground">Loading…</SoftCard>
      ) : filtered.length === 0 ? (
        <SoftCard><EmptyState icon={Bell} title="You're all caught up" description="No notifications match this filter." /></SoftCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([label, list]) => (
            <FadeIn key={label}>
              <div>
                <p className="text-[11px] uppercase font-semibold tracking-[0.14em] text-muted-foreground px-1 mb-2">{label}</p>
                <div className="space-y-2">
                  {list.map((n) => {
                    const Icon = catIcon[n.category] ?? Bell;
                    return (
                      <SoftCard key={n.id} className={cn("p-4 group transition", !n.read_at && "border-primary/25")}>
                        <div className="flex gap-3">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                            !n.read_at ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border")}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold truncate">{n.title}</p>
                              {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              {n.priority !== "normal" && (
                                <Badge className={cn("text-[10px] capitalize", priorityStyle[n.priority])}>{n.priority}</Badge>
                              )}
                              <span className="text-[11px] text-muted-foreground ml-auto">{timeAgo(n.created_at)}</span>
                            </div>
                            {n.body && <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              {n.cta_href && (
                                <Button asChild size="sm" variant="outline" className="h-7 rounded-full text-xs"
                                  onClick={() => !n.read_at && markRead.mutate([n.id])}>
                                  <Link to={n.cta_href}>{n.cta_label || "Open"}</Link>
                                </Button>
                              )}
                              {!n.read_at && (
                                <button className="text-[11px] text-muted-foreground hover:text-primary" onClick={() => markRead.mutate([n.id])}>Mark read</button>
                              )}
                              <button className="text-[11px] text-muted-foreground hover:text-foreground ml-auto opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1"
                                onClick={() => archive.mutate(n.id)}><Archive className="w-3 h-3" />Archive</button>
                              <button className="text-[11px] text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1"
                                onClick={() => remove.mutate(n.id)}><Trash2 className="w-3 h-3" />Delete</button>
                            </div>
                          </div>
                        </div>
                      </SoftCard>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}