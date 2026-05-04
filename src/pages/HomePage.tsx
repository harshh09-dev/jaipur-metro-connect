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
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Jaipur Metro Station" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(212,100%,18%)]/95 via-[hsl(212,100%,22%)]/85 to-[hsl(212,100%,30%)]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(212,100%,12%)]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 text-sm border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-white/90 font-medium tracking-wide">Official JMRC Citizen Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold mb-5 leading-[1.05] tracking-tight text-white">
                Smart Metro Services<br />
                for <span className="text-accent">Jaipur</span>
              </h1>
              <p className="text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
                Check routes, fares, timings, smart cards, complaints, updates, and citizen services — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/journey-planner">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold gap-2 h-12 px-6 shadow-lg shadow-accent/30">
                    Plan Journey <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/smart-card">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base font-semibold gap-2 h-12 px-6 shadow-lg">
                    <CreditCard className="w-4 h-4" /> Recharge Card
                  </Button>
                </Link>
                <Link to="/metro-map">
                  <Button size="lg" variant="outline" className="text-base font-semibold border-white/30 text-white hover:bg-white/10 h-12 px-6 backdrop-blur-sm">
                    View Services
                  </Button>
                </Link>
              </div>

              {/* Real stats from Wikipedia */}
              <div className="flex items-center gap-6 mt-10 pt-6 border-t border-white/10">
                {[
                  { icon: Users, value: "55K+", label: "Daily Riders" },
                  { icon: Route, value: "11.97 km", label: "Network" },
                  { icon: Train, value: "11", label: "Stations" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-accent" />
                    <div>
                      <span className="text-white font-bold text-sm">{item.value}</span>
                      <span className="text-white/50 text-xs ml-1">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Route Finder */}
            <div className="animate-slide-in-right">
              <Card className="bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-foreground font-semibold text-lg mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <Train className="w-4 h-4 text-accent-foreground" />
                    </div>
                    Quick Route Finder
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block uppercase tracking-wider">From</label>
                      <Select value={source} onValueChange={setSource}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select source station" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStations.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name} <span className="text-muted-foreground ml-1">({s.line === "pink" ? "Pink" : "Orange"})</span></SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => { setSource(destination); setDestination(source); }}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors border border-border"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block uppercase tracking-wider">To</label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select destination station" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStations.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name} <span className="text-muted-foreground ml-1">({s.line === "pink" ? "Pink" : "Orange"})</span></SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {result && (
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                        <div className="text-center p-3 rounded-lg bg-accent/10">
                          <div className="text-2xl font-bold text-accent">₹{result.fare}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Fare</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold text-foreground">{result.stations}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Stations</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold text-foreground">{result.time}m</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Time</div>
                        </div>
                      </div>
                    )}

                    <Link to="/journey-planner" className="block">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-11 text-base shadow-md">
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
        <section className="bg-warning/10 border-b border-warning/20">
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

      {/* Quick Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Smart Metro Services</h2>
            <p className="text-muted-foreground">Everything you need for a seamless metro experience</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path} className="group">
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-border/50">
                    <CardContent className="p-5 text-center">
                      <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-1">{link.label}</h3>
                      <p className="text-xs text-muted-foreground leading-snug">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About JMRC */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">Metro Network</h2>
              <p className="text-muted-foreground">Pink Line operational · Orange Line planned</p>
            </div>
            <Link to="/metro-map">
              <Button variant="outline" size="sm" className="gap-1">View Map <ArrowRight className="w-3 h-3" /></Button>
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
      <section className="py-16">
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
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">Explore Jaipur via Metro</h2>
              <p className="text-muted-foreground">Discover top attractions accessible from Pink Line stations</p>
            </div>
            <Link to="/tourism">
              <Button variant="outline" size="sm" className="gap-1">View All <ArrowRight className="w-3 h-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {touristSpots.slice(0, 4).map(spot => (
              <Card key={spot.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-44 bg-muted overflow-hidden relative">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-white/90 text-foreground text-[10px] font-semibold backdrop-blur-sm px-2 py-0.5 rounded-full">{spot.category}</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-2">{spot.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <Train className="w-3.5 h-3.5 text-accent" />
                    <span>{spot.nearestStation}</span>
                    <span className="text-foreground font-semibold">· {spot.distance}</span>
                  </div>
                  <Link to={`/journey-planner?to=${spot.nearestStationId}`}>
                    <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-1 h-9">
                      Plan Route <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Card CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Smart Card</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ride Smarter with JMRC Card</h2>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">Get 15% discount on every journey with Store Value smart cards. Also available: JMRC/HDFC Bank co-branded cards and Tourist cards for 1-day or 3-day unlimited travel.</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Store Value cards for regular commuters</li>
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Tourist cards — 1 day & 3 day unlimited travel</li>
                <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-accent" /> Available at all station counters</li>
              </ul>
              <div className="flex gap-3">
                <Link to="/smart-card">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 shadow-lg shadow-secondary/20">
                    <CreditCard className="w-4 h-4" /> Check Balance
                  </Button>
                </Link>
                <Link to="/smart-card">
                  <Button size="lg" variant="outline" className="gap-2">Recharge Now</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/10 rounded-3xl blur-xl" />
                <div className="relative bg-gradient-to-br from-primary via-primary to-secondary rounded-2xl p-7 text-white w-80 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">JMRC Smart Card</p>
                    <div className="w-8 h-5 bg-warning/80 rounded-sm" />
                  </div>
                  <p className="text-xl font-mono font-bold tracking-[0.15em] mb-8">4532 8890 XXXX</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Balance</p>
                      <p className="text-2xl font-extrabold">₹145</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">Latest Announcements</h2>
              <p className="text-muted-foreground">Stay updated with metro news and updates</p>
            </div>
            <Link to="/announcements">
              <Button variant="outline" size="sm" className="gap-1">View All <ArrowRight className="w-3 h-3" /></Button>
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
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80" />
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
