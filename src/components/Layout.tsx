import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Train,
  MapPin,
  Clock,
  MessageSquare,
  Search,
  AlertTriangle,
  Megaphone,
  Menu,
  X,
  Map,
  ArrowRight,
  Phone,
  Mail,
  Building2,
  Landmark,
  CreditCard,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import jmrcLogo from "@/assets/jmrc-logo.png";

const publicNav = [
  { path: "/", label: "Home", icon: Train },
  { path: "/journey-planner", label: "Journey", icon: Train },
  { path: "/metro-map", label: "Routes", icon: Map },
  { path: "/stations", label: "Stations", icon: MapPin },
  { path: "/timings", label: "Timetable", icon: Clock },
  { path: "/announcements", label: "News", icon: Megaphone },
];

const authedNav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/journey-planner", label: "Journey", icon: Train },
  { path: "/smart-card", label: "Smart Card", icon: CreditCard },
  { path: "/complaints", label: "Complaints", icon: MessageSquare },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const nav = useNavigate();
  const { user, profile, signOut } = useAuth();
  const navItems = user ? authedNav : publicNav;
  const initials = (profile?.full_name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 lg:h-[60px] px-3 lg:px-5 rounded-full bg-background/80 backdrop-blur-xl border border-border/70 shadow-[0_8px_30px_-12px_rgba(18,59,99,0.18)]">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <img src={jmrcLogo} alt="JMRC" className="w-6 h-6 object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="text-foreground text-[15px] font-bold tracking-tight">JMRC <span className="text-primary">Connect</span></h1>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-primary rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shadow-sm">
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold truncate">{profile?.full_name || "Passenger"}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{profile?.passenger_id}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/dashboard")}><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/smart-card")}><CreditCard className="w-4 h-4 mr-2" />Smart Card</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/complaints")}><MessageSquare className="w-4 h-4 mr-2" />Complaints</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/profile")}><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); nav("/"); }}><LogOut className="w-4 h-4 mr-2" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth"><Button variant="ghost" size="sm" className="rounded-full">Sign in</Button></Link>
                <Link to="/auth"><Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(210,65%,30%)] px-4 shadow-sm">Create Account</Button></Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-3 sm:mx-4 max-w-7xl bg-card rounded-2xl border border-border shadow-xl animate-fade-in overflow-hidden">
          <nav className="px-3 py-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border space-y-1">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted"><User className="w-4 h-4" />Profile</Link>
                  <button onClick={async () => { await signOut(); setMobileOpen(false); nav("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted"><LogOut className="w-4 h-4" />Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted"><User className="w-4 h-4" />Sign in</Link>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground mt-2">Create Account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <img src={jmrcLogo} alt="JMRC" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">JMRC Connect</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">Jaipur Metro Rail Corporation Ltd. — India's first metro on a triple-storey elevated road. Serving Jaipur since 3 June 2015.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-primary-foreground/50 mb-5">Routes</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/journey-planner" className="text-primary-foreground/70 hover:text-accent transition-colors">Journey Planner</Link></li>
              <li><Link to="/metro-map" className="text-primary-foreground/70 hover:text-accent transition-colors">Metro Map</Link></li>
              <li><Link to="/stations" className="text-primary-foreground/70 hover:text-accent transition-colors">Stations</Link></li>
              <li><Link to="/timings" className="text-primary-foreground/70 hover:text-accent transition-colors">Timings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-primary-foreground/50 mb-5">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/complaints" className="text-primary-foreground/70 hover:text-accent transition-colors">File Complaint</Link></li>
              <li><Link to="/track-complaint" className="text-primary-foreground/70 hover:text-accent transition-colors">Track Complaint</Link></li>
              <li><Link to="/alerts" className="text-primary-foreground/70 hover:text-accent transition-colors">Service Alerts</Link></li>
              <li><Link to="/announcements" className="text-primary-foreground/70 hover:text-accent transition-colors">Announcements</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.15em] text-primary-foreground/50 mb-5">Contact</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-accent" /> 0141-2822100</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-accent" /> 1800-180-6060</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-accent" /> cmd@jaipurmetrorail.in</li>
              <li className="flex items-start gap-2"><Building2 className="w-3.5 h-3.5 text-accent mt-0.5" /> <span>Khanij Bhavan, C-Scheme, Jaipur</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 Jaipur Metro Rail Corporation. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-primary-foreground/50">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
