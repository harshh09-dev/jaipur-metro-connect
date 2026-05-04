import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import jmrcLogo from "@/assets/jmrc-logo.png";

const navItems = [
  { path: "/", label: "Home", icon: Train },
  { path: "/journey-planner", label: "Services", icon: Train },
  { path: "/metro-map", label: "Routes", icon: Map },
  { path: "/complaints", label: "Support", icon: MessageSquare },
  { path: "/announcements", label: "About", icon: Megaphone },
  { path: "/alerts", label: "Contact", icon: Phone },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <img src={jmrcLogo} alt="JMRC Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="text-foreground text-base font-extrabold leading-none tracking-tight">JMRC <span className="text-primary">Connect</span></h1>
              <p className="text-muted-foreground text-[10px] font-medium tracking-[0.15em] uppercase">Smart Metro Services</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/track-complaint">
              <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-muted gap-1.5">
                <Search className="w-4 h-4" />
                Track
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-md shadow-primary/20">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
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
              <Link to="/track-complaint" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted">
                <Search className="w-4 h-4" /> Track Complaint
              </Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground mt-2">
                Admin Dashboard
              </Link>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={jmrcLogo} alt="JMRC Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg">JMRC</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">Jaipur Metro Rail Corporation Ltd. — India's first metro on a triple-storey elevated road. Serving Jaipur since 3 June 2015.</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40 mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/journey-planner" className="text-primary-foreground/70 hover:text-accent transition-colors">Journey Planner</Link></li>
              <li><Link to="/metro-map" className="text-primary-foreground/70 hover:text-accent transition-colors">Metro Map</Link></li>
              <li><Link to="/stations" className="text-primary-foreground/70 hover:text-accent transition-colors">Stations</Link></li>
              <li><Link to="/timings" className="text-primary-foreground/70 hover:text-accent transition-colors">Timings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40 mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/complaints" className="text-primary-foreground/70 hover:text-accent transition-colors">File Complaint</Link></li>
              <li><Link to="/track-complaint" className="text-primary-foreground/70 hover:text-accent transition-colors">Track Complaint</Link></li>
              <li><Link to="/alerts" className="text-primary-foreground/70 hover:text-accent transition-colors">Service Alerts</Link></li>
              <li><Link to="/announcements" className="text-primary-foreground/70 hover:text-accent transition-colors">Announcements</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40 mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-accent" /> 0141-2822100</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-accent" /> 1800-180-6060 (Toll Free)</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-accent" /> cmd@jaipurmetrorail.in</li>
              <li className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-accent" /> Khanij Bhavan, C-Scheme, Jaipur</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 Jaipur Metro Rail Corporation. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
