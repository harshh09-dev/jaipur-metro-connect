import { announcements } from "@/data/metro-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Newspaper } from "lucide-react";

const categoryConfig: Record<string, { color: string; label: string }> = {
  news: { color: "bg-secondary/10 text-secondary", label: "News" },
  update: { color: "bg-info/10 text-info", label: "Update" },
  event: { color: "bg-accent/10 text-accent", label: "Event" },
};

export default function AnnouncementsPage() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-2">
            <Newspaper className="w-4 h-4" />
            Updates
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Announcements</h1>
          <p className="text-muted-foreground">Latest metro updates, news and events.</p>
        </div>

        <div className="space-y-4">
          {announcements.map(a => {
            const config = categoryConfig[a.category] || categoryConfig.news;
            return (
              <Card key={a.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Megaphone className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={config.color}>{config.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{a.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.content}</p>
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
