import { Link } from "react-router-dom";
import { Train, MapPin, Clock, MessageSquare, AlertTriangle, ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceAlerts, announcements } from "@/data/metro-data";

const quickLinks = [
  { path: "/journey-planner", label: "Journey Planner", description: "Plan your route, check fare & travel time", icon: Train, color: "bg-primary" },
  { path: "/stations", label: "Metro Stations", description: "Explore stations, facilities & nearby places", icon: MapPin, color: "bg-secondary" },
  { path: "/timings", label: "Metro Timings", description: "First train, last train & frequency", icon: Clock, color: "bg-metro-gold" },
  { path: "/complaints", label: "File Complaint", description: "Report an issue or share feedback", icon: MessageSquare, color: "bg-success" },
];

export default function HomePage() {
  const activeAlerts = serviceAlerts.filter(a => a.active);
  const latestAnnouncements = announcements.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="metro-gradient text-primary-foreground py-16 sm:py-24">
        <div className="page-container text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Train className="w-4 h-4" />
            <span>Jaipur's Lifeline Since 2015</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Travel Smarter with<br />Jaipur Metro
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Fast, safe and affordable metro rail service connecting Jaipur. 
            Plan your journey, check timings and more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/journey-planner">
              <Button size="lg" variant="secondary" className="text-base font-semibold gap-2">
                Plan Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/stations">
              <Button size="lg" variant="outline" className="text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                View Stations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <section className="bg-warning/10 border-b border-warning/20">
          <div className="page-container py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{activeAlerts.length} Active Service Alert{activeAlerts.length > 1 ? "s" : ""}</p>
                <p className="text-sm text-muted-foreground">{activeAlerts[0].title}</p>
              </div>
              <Link to="/alerts" className="text-sm text-primary font-medium hover:underline shrink-0">View All</Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="page-container">
        <h2 className="section-header text-center">Quick Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path} className="metro-card p-6 group">
                <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{link.label}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Metro Stats */}
      <section className="bg-muted py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "2", label: "Metro Lines" },
              { value: "18", label: "Stations" },
              { value: "32 km", label: "Total Route" },
              { value: "80K+", label: "Daily Riders" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-header mb-0">Latest Announcements</h2>
          <Link to="/announcements" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-4">
          {latestAnnouncements.map(a => (
            <div key={a.id} className="metro-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="metro-badge bg-muted text-muted-foreground capitalize">{a.category}</span>
                  <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
