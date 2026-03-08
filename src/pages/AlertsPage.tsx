import { serviceAlerts } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, Zap, Bell } from "lucide-react";

const typeConfig = {
  delay: { icon: AlertTriangle, label: "Delay", color: "bg-warning/10 text-warning", border: "border-warning/20" },
  maintenance: { icon: Wrench, label: "Maintenance", color: "bg-info/10 text-info", border: "border-info/20" },
  emergency: { icon: Zap, label: "Emergency", color: "bg-destructive/10 text-destructive", border: "border-destructive/20" },
};

export default function AlertsPage() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Bell className="w-4 h-4" />
            Real-time
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Service Alerts</h1>
          <p className="text-muted-foreground">Metro delays, maintenance and emergency alerts.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(["delay", "maintenance", "emergency"] as const).map(type => {
            const count = serviceAlerts.filter(a => a.type === type && a.active).length;
            const config = typeConfig[type];
            const Icon = config.icon;
            return (
              <Card key={type} className={count > 0 ? config.border : ""}>
                <CardContent className="p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${config.color.split(" ")[1]}`} />
                  <div className="text-2xl font-extrabold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{type}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {serviceAlerts.map(alert => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <Card key={alert.id} className={`${alert.active ? config.border : ""} transition-all hover:shadow-md`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={config.color}>{config.label}</Badge>
                        <Badge variant="outline" className="text-xs">{alert.affectedLine}</Badge>
                        {alert.active && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-gentle" />
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {alert.affectedStations.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
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
    </div>
  );
}
