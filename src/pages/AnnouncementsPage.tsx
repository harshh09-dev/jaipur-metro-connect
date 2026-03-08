import { announcements } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

const categoryColors: Record<string, string> = {
  news: "bg-primary/10 text-primary",
  update: "bg-info/10 text-info",
  event: "bg-secondary/10 text-secondary",
};

export default function AnnouncementsPage() {
  return (
    <div className="page-container">
      <h1 className="section-header">Announcements</h1>
      <p className="text-muted-foreground mb-8 -mt-4">Latest metro updates, news and events.</p>

      <div className="space-y-4 max-w-3xl">
        {announcements.map(a => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`metro-badge capitalize ${categoryColors[a.category] || ""}`}>{a.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
