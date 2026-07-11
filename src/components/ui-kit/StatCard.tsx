import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delta?: string;
  tone?: "default" | "success" | "danger";
}

export function StatCard({ icon: Icon, label, value, delta, tone = "default" }: Props) {
  const toneCls =
    tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : "text-primary";
  return (
    <Card className="rounded-2xl border-border/60 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardContent className="p-5">
        <div className={`w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3 ${toneCls}`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {delta && <span className="text-xs font-medium text-success">{delta}</span>}
        </div>
      </CardContent>
    </Card>
  );
}