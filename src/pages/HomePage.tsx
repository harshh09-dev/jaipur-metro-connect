import { useState } from "react";
import { Link } from "react-router-dom";
import { Train, MapPin, Clock, MessageSquare, AlertTriangle, ArrowRight, Megaphone, Map, Search, ArrowRightLeft, Shield, Zap, CreditCard, Landmark, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceAlerts, announcements, allStations, calculateFare, metroLines } from "@/data/metro-data";
import { touristSpots } from "@/data/tourist-data";

const quickLinks = [
  { path: "/journey-planner", label: "Journey Planner", description: "Plan route, check fare & time", icon: Train, color: "bg-secondary" },
  { path: "/metro-map", label: "Metro Map", description: "Interactive network map", icon: Map, color: "bg-accent" },
  { path: "/stations", label: "Stations", description: "Facilities & nearby places", icon: MapPin, color: "bg-success" },
  { path: "/tourism", label: "Tourism", description: "Explore Jaipur via metro", icon: Landmark, color: "bg-info" },
  { path: "/smart-card", label: "Smart Card", description: "Balance & recharge", icon: CreditCard, color: "bg-warning" },
  { path: "/complaints", label: "File Complaint", description: "Report issues or feedback", icon: MessageSquare, color: "bg-metro-slate" },
];

export default function HomePage() {
  const activeAlerts = serviceAlerts.filter(a => a.active);
  const latestAnnouncements = announcements.slice(0, 3);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const result = source && destination && source !== destination
    ? calculateFare(
        allStations.find(s => s.id === source)!,
        allStations.find(s => s.id === destination)!
      )
    : null;

  return (
    <div>
      {/* Hero Section - Split Layout */}
      <section className="metro-gradient text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 mb-6 text-sm border border-primary-foreground/10">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-gentle" />
                <span className="text-primary-foreground/80">All lines operational</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-[1.1] tracking-tight">
                Plan Your Metro<br />
                Journey in <span className="text-accent">Seconds</span>
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-lg mb-8 leading-relaxed">
                Smart route planning, real-time service alerts, and instant complaint support for Jaipur Metro passengers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/journey-planner">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold gap-2 h-12 px-6">
                    Plan Journey <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/metro-map">
                  <Button size="lg" variant="outline" className="text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-6">
                    View Metro Map
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Mini Journey Planner Card */}
            <div className="animate-slide-in-right">
              <Card className="glass-card border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h3 className="text-primary-foreground font-semibold text-lg mb-4 flex items-center gap-2">
                    <Train className="w-5 h-5 text-accent" />
                    Quick Route Finder
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-primary-foreground/50 font-medium mb-1 block">FROM</label>
                      <Select value={source} onValueChange={setSource}>
                        <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground">
                          <SelectValue placeholder="Select station" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStations.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => { setSource(destination); setDestination(source); }}
                        className="p-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-primary-foreground/60" />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-primary-foreground/50 font-medium mb-1 block">TO</label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground">
                          <SelectValue placeholder="Select station" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStations.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {result && (
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-primary-foreground/10">
                        <div className="text-center p-3 rounded-lg bg-primary-foreground/10">
                          <div className="text-2xl font-bold text-accent">₹{result.fare}</div>
                          <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider">Fare</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-primary-foreground/10">
                          <div className="text-2xl font-bold text-primary-foreground">{result.stations}</div>
                          <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider">Stations</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-primary-foreground/10">
                          <div className="text-2xl font-bold text-primary-foreground">{result.time}m</div>
                          <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider">Time</div>
                        </div>
                      </div>
                    )}

                    <Link to="/journey-planner" className="block">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                        View Full Route <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <section className="bg-accent/5 border-b border-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground truncate">{activeAlerts[0].title}</p>
              </div>
              <Link to="/alerts">
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent gap-1 shrink-0">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Metro Lines Overview */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-header mb-0">Metro Network</h2>
          <Link to="/metro-map">
            <Button variant="ghost" size="sm" className="text-secondary gap-1">View Map <ArrowRight className="w-3 h-3" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metroLines.map(line => (
            <Card key={line.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }}>
                        <Train className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{line.name}</h3>
                        <p className="text-xs text-muted-foreground">{line.stations.length} stations</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{line.id === "pink" ? "East–West" : "North–South"}</Badge>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {line.stations.map((s, i) => (
                      <div key={s.id} className="flex items-center shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }} />
                        <span className="text-[9px] text-muted-foreground mx-1 whitespace-nowrap">{s.name}</span>
                        {i < line.stations.length - 1 && <div className="w-4 h-0.5 bg-border" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Services */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-header text-center">Quick Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path} className="metro-card p-5 group text-center">
                  <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{link.label}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">{link.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="page-container">
        <div className="metro-gradient rounded-2xl p-8 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-primary-foreground">
            {[
              { value: "2", label: "Metro Lines", icon: Train },
              { value: "18", label: "Stations", icon: MapPin },
              { value: "32 km", label: "Total Route", icon: Map },
              { value: "80K+", label: "Daily Riders", icon: Zap },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label}>
                  <Icon className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-3xl sm:text-4xl font-extrabold">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore Jaipur via Metro */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-header mb-0">Explore Jaipur via Metro</h2>
          <Link to="/tourism">
            <Button variant="ghost" size="sm" className="text-secondary gap-1">View All <ArrowRight className="w-3 h-3" /></Button>
          </Link>
        </div>
        <p className="text-muted-foreground mb-6 -mt-2">Discover top attractions easily accessible by metro.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {touristSpots.slice(0, 4).map(spot => (
            <Card key={spot.id} className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="h-36 bg-muted overflow-hidden">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm text-foreground mb-1">{spot.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Train className="w-3 h-3 text-secondary" />
                  <span>{spot.nearestStation}</span>
                  <span className="font-semibold text-foreground">· {spot.distance}</span>
                </div>
                <Link to={`/journey-planner?to=${spot.nearestStationId}`}>
                  <Button size="sm" variant="outline" className="w-full text-xs gap-1 h-8">
                    Plan Route <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Smart Card CTA */}
      <section className="bg-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-secondary text-secondary-foreground mb-3">Smart Card</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ride Smarter with JMRC Card</h2>
              <p className="text-muted-foreground mb-4">Get 15% discount on every journey. Check balance, recharge online, and skip the queue.</p>
              <div className="flex gap-3">
                <Link to="/smart-card">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                    <CreditCard className="w-4 h-4" /> Check Balance
                  </Button>
                </Link>
                <Link to="/smart-card">
                  <Button variant="outline" className="gap-2">Recharge Now</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-primary via-primary to-secondary/80 rounded-2xl p-6 text-primary-foreground w-72 shadow-xl">
                <p className="text-[10px] text-primary-foreground/50 uppercase tracking-widest mb-1">JMRC Smart Card</p>
                <p className="text-lg font-mono font-bold tracking-wider mb-6">4532 8890 XXXX</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-primary-foreground/50">Balance</p>
                    <p className="text-xl font-extrabold">₹145</p>
                  </div>
                  <CreditCard className="w-6 h-6 text-primary-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Announcements */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-header mb-0">Latest Announcements</h2>
          <Link to="/announcements">
            <Button variant="ghost" size="sm" className="text-secondary gap-1">View All <ArrowRight className="w-3 h-3" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestAnnouncements.map(a => (
            <Card key={a.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="capitalize text-xs">{a.category}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Shield className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Have an issue? We're here to help.</h2>
            <p className="text-muted-foreground mb-6">File a complaint or share feedback about your metro experience. Track your complaint status in real-time.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/complaints">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <MessageSquare className="w-4 h-4" /> File Complaint
                </Button>
              </Link>
              <Link to="/track-complaint">
                <Button size="lg" variant="outline" className="gap-2">
                  <Search className="w-4 h-4" /> Track Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
