import { serviceAlerts } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, Zap } from "lucide-react";

const typeConfig = {
  delay: { icon: AlertTriangle, label: "Delay", badgeClass: "bg-warning/10 text-warning" },
  maintenance: { icon: Wrench, label: "Maintenance", badgeClass: "bg-info/10 text-info" },
  emergency: { icon: Zap, label: "Emergency", badgeClass: "bg-destructive/10 text-destructive" },
};

export default function AlertsPage() {
  return (
    <div className="page-container">
      <h1 className="section-header">Service Alerts</h1>
      <p className="text-muted-foreground mb-8 -mt-4">Metro delays, maintenance announcements and emergency alerts.</p>

      <div className="space-y-4 max-w-3xl">
        {serviceAlerts.map(alert => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <Card key={alert.id} className={alert.type === "emergency" ? "border-destructive/30" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.badgeClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`metro-badge ${config.badgeClass}`}>{config.label}</span>
                      <Badge variant="outline">{alert.affectedLine}</Badge>
                      {alert.active && <span className="metro-badge bg-success/10 text-success animate-pulse-gentle">Active</span>}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {alert.affectedStations.map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.startTime).toLocaleString("en-IN")}
                      {alert.endTime && ` — ${new Date(alert.endTime).toLocaleString("en-IN")}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
