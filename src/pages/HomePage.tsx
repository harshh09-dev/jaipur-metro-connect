import { useState } from "react";
import { Link } from "react-router-dom";
import { Train, MapPin, Clock, MessageSquare, AlertTriangle, ArrowRight, Megaphone, Map, Search, ArrowRightLeft, Shield, Zap, CreditCard, Landmark, TreePine, ChevronRight, Users, Route, Building2, Calendar, Info, Calculator, PackageSearch, BookOpen, Phone, Smartphone, Apple, PlayCircle, Sparkles, Headphones, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceAlerts, announcements, allStations, pinkLineStations, calculateFare, metroLines, jmrcInfo } from "@/data/metro-data";
import { touristSpots } from "@/data/tourist-data";
import heroImage from "@/assets/hero-metro.jpg";

const quickAccess = [
  { path: "/metro-map", label: "Route Map", icon: Map, tone: "from-primary to-secondary" },
  { path: "/journey-planner", label: "Fare Calculator", icon: Calculator, tone: "from-accent to-emerald-500" },
  { path: "/timings", label: "Train Timings", icon: Clock, tone: "from-amber-500 to-orange-500" },
  { path: "/smart-card", label: "Smart Card", icon: CreditCard, tone: "from-violet-500 to-fuchsia-500" },
  { path: "/complaints", label: "Complaint Portal", icon: MessageSquare, tone: "from-rose-500 to-pink-500" },
  { path: "/complaints", label: "Lost & Found", icon: PackageSearch, tone: "from-cyan-500 to-sky-500" },
  { path: "/announcements", label: "Metro Rules", icon: BookOpen, tone: "from-slate-600 to-slate-800" },
  { path: "/alerts", label: "Helpline", icon: Phone, tone: "from-primary to-accent" },
];

const whyJmrc = [
  { icon: Zap, title: "Fast Access", desc: "Plan journeys, check fares and recharge in seconds — no logins, no clutter." },
  { icon: Bell, title: "Real-time Information", desc: "Live alerts, station updates and announcements from JMRC, all in one place." },
  { icon: Headphones, title: "Citizen-first Support", desc: "File complaints, track status and reach the 24×7 helpline directly." },
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
      {/* Hero Section */}
      <section className="relative h-[420px] sm:h-[520px] lg:h-[620px] flex items-center overflow-hidden mx-3 sm:mx-4 mt-4 rounded-3xl">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Jaipur Metro Station" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210,70%,12%)]/90 via-[hsl(210,70%,15%)]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full">
          <div className="max-w-2xl animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 mb-5 text-xs border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-white/90 font-medium tracking-wide">Official JMRC Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.1] tracking-tight text-white">
                Smart Metro Services<br />
                for <span className="text-[hsl(35,60%,82%)]">Jaipur</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mb-7 leading-relaxed">
                Plan journeys, recharge smart cards, explore Jaipur, and manage metro services seamlessly.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/journey-planner">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-[hsl(210,65%,30%)] text-sm sm:text-base font-semibold gap-2 h-11 sm:h-12 px-5 sm:px-6 rounded-full shadow-lg">
                    Plan Journey <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/metro-map">
                  <Button size="lg" variant="outline" className="text-sm sm:text-base font-semibold border-white/40 bg-white/5 text-white hover:bg-white/15 h-11 sm:h-12 px-5 sm:px-6 rounded-full backdrop-blur-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <section className="bg-warning/10 border-y border-warning/20 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground truncate">{activeAlerts[0].title}</p>
              </div>
              <Link to="/alerts">
                <Button variant="ghost" size="sm" className="text-warning hover:text-warning gap-1 shrink-0">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Access Cards */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">Quick Access</h2>
            <p className="text-sm text-muted-foreground">Essential metro services, one tap away.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickAccess.slice(0, 6).map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.label} to={link.path} className="group">
                  <Card className="h-full bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-border rounded-2xl">
                    <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground leading-tight">{link.label}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Route Finder */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Plan Your Journey</h2>
            <p className="text-sm text-muted-foreground">Find fares, time and stations between any two metro stops.</p>
          </div>
          <Card className="bg-card border-border shadow-md rounded-2xl">
            <CardContent className="p-5 sm:p-7">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-end">
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium mb-1.5 block uppercase tracking-wider">From</label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Source station" /></SelectTrigger>
                    <SelectContent>
                      {allStations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <button onClick={() => { setSource(destination); setDestination(source); }} className="hidden sm:flex h-11 w-11 mx-auto items-center justify-center rounded-full bg-card hover:bg-muted border border-border transition-colors">
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </button>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium mb-1.5 block uppercase tracking-wider">To</label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Destination station" /></SelectTrigger>
                    <SelectContent>
                      {allStations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {result && (
                <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-border">
                  <div className="text-center p-3 rounded-xl bg-muted">
                    <div className="text-xl sm:text-2xl font-bold text-primary">₹{result.fare}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Fare</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted">
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{result.stations}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Stations</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted">
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{result.time}m</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Time</div>
                  </div>
                </div>
              )}
              <Link to="/journey-planner" className="block mt-5">
                <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(210,65%,30%)] h-11 gap-2">
                  View Full Route <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why JMRC Connect */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Built for the citizens of Jaipur</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">A modern, trusted platform that brings every metro service to your fingertips.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {whyJmrc.map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="bg-card border border-border rounded-2xl hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About JMRC */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <Badge variant="secondary" className="mb-4">About JMRC</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">Jaipur Metro Rail Corporation</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The Jaipur Metro is a rapid transit system serving Jaipur, Rajasthan's capital city. Established on {jmrcInfo.established}, JMRC began commercial operations on {jmrcInfo.commercialService}. It is the <strong className="text-foreground">first metro in India to run on a triple-storey elevated road and metro track</strong>.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Pink Line (East–West Corridor) runs {jmrcInfo.totalNetworkLength} from Mansarovar to Badi Chaupar across 11 stations, connecting key areas including Railway Station, Sindhi Camp, and the historic walled city.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Track Gauge", value: "Standard (1435 mm)" },
                  { label: "Top Speed", value: jmrcInfo.topSpeed },
                  { label: "Rolling Stock", value: "10 trains, 4 coaches" },
                  { label: "Electrification", value: "25 kV AC OHE" },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                HQ: {jmrcInfo.headquarters} · CMD: {jmrcInfo.chairman}
              </p>
            </div>

            {/* Phase Timeline */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> Project Phases
              </h3>
              <div className="space-y-4">
                {[
                  { ...jmrcInfo.phase1A, status: "Completed", color: "bg-success" },
                  { ...jmrcInfo.phase1B, status: "Completed", color: "bg-success" },
                  { ...jmrcInfo.phase1C, status: "DPR Ready", color: "bg-warning" },
                  { ...jmrcInfo.phase1D, status: "Planned", color: "bg-info" },
                  { ...jmrcInfo.phase2, status: "Planned", color: "bg-secondary" },
                ].map((phase, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${phase.color} shrink-0 mt-1`} />
                      {i < 4 && <div className="w-0.5 h-full bg-border min-h-[2rem]" />}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-foreground">{phase.name}</h4>
                          <Badge variant="outline" className="text-[10px]">{phase.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{phase.route} · {phase.length} · {phase.stations} station{phase.stations > 1 ? "s" : ""}</p>
                        {"opened" in phase && <p className="text-xs text-success mt-1">Opened: {phase.opened}</p>}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metro Lines Overview */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">Metro Network</h2>
              <p className="text-sm text-muted-foreground">Pink Line operational · Orange Line planned</p>
            </div>
            <Link to="/metro-map">
              <Button variant="outline" size="sm" className="gap-1 rounded-full">View Map <ArrowRight className="w-3 h-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {metroLines.map(line => (
              <Card key={line.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="h-1.5" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }}>
                          <Train className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{line.name}</h3>
                          <p className="text-sm text-muted-foreground">{line.stations.length} stations · {line.length} · {line.corridor}</p>
                        </div>
                      </div>
                      <Badge variant={line.status === "operational" ? "default" : "secondary"} className="text-[10px]">
                        {line.status === "operational" ? "Operational" : "Planned"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {line.stations.map((s, i) => (
                        <div key={s.id} className="flex items-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)", backgroundColor: i === 0 || i === line.stations.length - 1 ? (line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)") : "transparent" }} />
                          <span className="text-[10px] text-muted-foreground mx-1 whitespace-nowrap">{s.name}</span>
                          {i < line.stations.length - 1 && <div className="w-6 h-0.5" style={{ backgroundColor: line.id === "pink" ? "hsl(347, 77%, 50%)" : "hsl(43, 96%, 56%)" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" />
            <div className="relative p-10 sm:p-14">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                {[
                  { value: "1", label: "Operational Line", icon: Train },
                  { value: "11", label: "Stations", icon: MapPin },
                  { value: "11.97 km", label: "Route Length", icon: Map },
                  { value: "55K+", label: "Daily Riders", icon: Zap },
                ].map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label}>
                      <Icon className="w-7 h-7 mx-auto mb-3 text-accent" />
                      <div className="text-4xl sm:text-5xl font-extrabold">{stat.value}</div>
                      <div className="text-sm text-white/60 mt-1 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Jaipur via Metro */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">Explore Jaipur by Metro</h2>
              <p className="text-sm text-muted-foreground">Elegant cards for sightseeing, generous whitespace.</p>
            </div>
            <Link to="/tourism">
              <Button variant="outline" size="sm" className="gap-1 rounded-full">View All <ArrowRight className="w-3 h-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {touristSpots.slice(0, 4).map(spot => (
              <Card key={spot.id} className="group overflow-hidden bg-card border border-border rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-foreground mb-1.5 text-base">{spot.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {spot.distance} from <span className="font-semibold text-foreground">{spot.nearestStation}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">Recommended Station: <span className="font-semibold text-foreground">{spot.nearestStation}</span></p>
                  <Link to={`/journey-planner?to=${spot.nearestStationId}`} className="mt-auto">
                    <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(210,65%,30%)] h-9">
                      Visit
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Card CTA */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-card text-primary border border-border">Smart Card</Badge>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Ride Smarter with JMRC Card</h2>
              <p className="text-muted-foreground mb-5 text-base leading-relaxed">Get 15% discount on every journey with Store Value smart cards. Tourist cards offer unlimited 1-day or 3-day travel.</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Store Value cards for regular commuters</li>
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Tourist cards — 1 day & 3 day unlimited travel</li>
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Available at all station counters</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/smart-card">
                  <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(210,65%,30%)] gap-2">
                    <CreditCard className="w-4 h-4" /> Check Balance
                  </Button>
                </Link>
                <Link to="/smart-card">
                  <Button size="lg" variant="outline" className="rounded-full gap-2">Recharge Now</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 bg-primary/15 rounded-3xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-[hsl(210,70%,18%)] via-primary to-[hsl(210,70%,30%)] rounded-2xl p-7 text-white w-[20rem] sm:w-[22rem] shadow-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-medium">JMRC Smart Card</p>
                    <div className="w-8 h-5 bg-warning/80 rounded-sm" />
                  </div>
                  <p className="text-lg sm:text-xl font-mono font-bold tracking-[0.18em] mb-1">4532 8890 •••• 7821</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mb-6">Valid Thru 12/29</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">Card Holder</p>
                      <p className="text-sm font-semibold tracking-wide">ANJALI KAMAL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">Balance</p>
                      <p className="text-xl font-extrabold">₹ 145</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">Latest Announcements</h2>
              <p className="text-sm text-muted-foreground">Stay updated with metro news and updates</p>
            </div>
            <Link to="/announcements">
              <Button variant="outline" size="sm" className="gap-1 rounded-full">View All <ArrowRight className="w-3 h-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestAnnouncements.map(a => (
              <Card key={a.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize text-xs">{a.category}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">Mobile App</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">JMRC Connect, in your pocket</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">Get real-time alerts, scan QR tickets, and recharge your smart card on the go. Available soon for Android and iOS.</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-3 h-14 px-6">
                  <Apple className="w-6 h-6" />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] opacity-70">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </Button>
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-3 h-14 px-6">
                  <PlayCircle className="w-6 h-6" />
                  <div className="text-left leading-tight">
                    <div className="text-[10px] opacity-70">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                <div className="relative w-64 h-[480px] bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-3 shadow-2xl border-8 border-foreground/90">
                  <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-[10px] font-bold">9:41</div>
                      <Smartphone className="w-3 h-3" />
                    </div>
                    <div className="text-xs font-bold text-primary mb-1">JMRC Connect</div>
                    <h3 className="text-lg font-extrabold mb-4">Hello, Rider 👋</h3>
                    <Card className="mb-3 bg-gradient-to-br from-primary to-secondary text-white border-0">
                      <CardContent className="p-4">
                        <div className="text-[10px] opacity-70 uppercase">Smart Card</div>
                        <div className="text-xl font-extrabold mt-1">₹ 145</div>
                        <div className="text-[10px] opacity-70 mt-1">4532 8890 ••••</div>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="aspect-square rounded-xl bg-accent/10 flex flex-col items-center justify-center text-accent">
                        <Map className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-semibold">Map</span>
                      </div>
                      <div className="aspect-square rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                        <Train className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-semibold">Plan</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground mb-2">Live Alerts</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] p-2 rounded-lg bg-success/10 text-success">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" /> All lines operational
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Support CTA */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(210,65%,30%)] to-primary" />
            <div className="relative text-center py-14 px-6">
              <Shield className="w-12 h-12 text-white/90 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Have an issue? We're here to help.</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">File a complaint or share feedback about your metro experience. Track your complaint status in real-time.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/complaints">
                  <Button size="lg" className="bg-white text-accent hover:bg-white/90 gap-2 shadow-lg font-semibold">
                    <MessageSquare className="w-4 h-4" /> File Complaint
                  </Button>
                </Link>
                <Link to="/track-complaint">
                  <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10 font-semibold">
                    <Search className="w-4 h-4" /> Track Status
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
