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
  LayoutDashboard,
  Menu,
  X,
  Home,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/journey-planner", label: "Journey Planner", icon: Train },
  { path: "/stations", label: "Stations", icon: MapPin },
  { path: "/timings", label: "Timings", icon: Clock },
  { path: "/complaints", label: "File Complaint", icon: MessageSquare },
  { path: "/track-complaint", label: "Track Complaint", icon: Search },
  { path: "/alerts", label: "Service Alerts", icon: AlertTriangle },
  { path: "/announcements", label: "Announcements", icon: Megaphone },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Train className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-primary-foreground text-lg font-bold leading-tight">Jaipur Metro</h1>
              <p className="text-primary-foreground/70 text-xs">Rail Corporation</p>
            </div>
            <span className="sm:hidden text-primary-foreground font-bold">JMRC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-accent text-accent-foreground"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Train className="w-5 h-5 text-accent" />
              <span className="font-bold text-background">Jaipur Metro Rail Corporation</span>
            </div>
            <p className="text-sm text-background/60">Providing safe, reliable and efficient metro rail services to the people of Jaipur.</p>
          </div>
          <div>
            <h3 className="font-semibold text-background mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/journey-planner" className="hover:text-accent transition-colors">Journey Planner</Link></li>
              <li><Link to="/stations" className="hover:text-accent transition-colors">Metro Stations</Link></li>
              <li><Link to="/timings" className="hover:text-accent transition-colors">Metro Timings</Link></li>
              <li><Link to="/complaints" className="hover:text-accent transition-colors">File Complaint</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-background mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Helpline: 1800-180-6060</li>
              <li>Email: info@jaipurmetro.in</li>
              <li>Metro Bhawan, Jaipur, Rajasthan</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-8 pt-6 text-center text-xs text-background/40">
          © 2026 Jaipur Metro Rail Corporation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
