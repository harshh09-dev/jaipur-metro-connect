import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, MessageSquare, User, Route as RouteIcon,
  Map, Bell, LogOut, Search, Ticket, Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import jmrcLogo from "@/assets/jmrc-logo.png";
import { cn } from "@/lib/utils";

const primary = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart-card", label: "Smart Card", icon: CreditCard },
  { to: "/journey-planner", label: "Journey Planner", icon: RouteIcon },
  { to: "/metro-map", label: "Metro Map", icon: Map },
  { to: "/complaints", label: "Complaints", icon: MessageSquare },
];

const secondary = [
  { to: "/track-complaint", label: "Track Complaint", icon: Search },
  { to: "/announcements", label: "Announcements", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

const mobileTabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/journey-planner", label: "Journey", icon: RouteIcon },
  { to: "/smart-card", label: "Card", icon: CreditCard },
  { to: "/complaints", label: "Support", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
];

function SidebarBody() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
    );
  return (
    <>
      <div className="px-3 mb-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50 mb-2">
          Workspace
        </p>
        <nav className="space-y-0.5">
          {primary.map((i) => (
            <NavLink key={i.to} to={i.to} className={linkCls}>
              <i.icon className="w-4 h-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-3 mt-6">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50 mb-2">
          More
        </p>
        <nav className="space-y-0.5">
          {secondary.map((i) => (
            <NavLink key={i.to} to={i.to} className={linkCls}>
              <i.icon className="w-4 h-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const nav = useNavigate();
  const initials = (profile?.full_name || "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop / tablet sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-[240px] lg:w-[256px] bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border z-40">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
            <img src={jmrcLogo} alt="JMRC" className="w-6 h-6 object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-white text-[15px] font-bold tracking-tight">JMRC</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/60">Connect</p>
          </div>
        </Link>
        <div className="flex-1 overflow-y-auto py-5">
          <SidebarBody />
        </div>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={async () => { await signOut(); nav("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[240px] lg:pl-[256px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <Sheet>
              <SheetTrigger className="p-2 rounded-lg hover:bg-muted"><Menu className="w-5 h-5" /></SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-sidebar-border">
                <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <img src={jmrcLogo} alt="JMRC" className="w-6 h-6 object-contain" />
                  </div>
                  <p className="text-white text-[15px] font-bold tracking-tight">JMRC Connect</p>
                </div>
                <div className="py-5"><SidebarBody /></div>
              </SheetContent>
            </Sheet>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={jmrcLogo} alt="JMRC" className="w-6 h-6" />
              <span className="font-bold text-sm">JMRC</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search stations, routes, tickets…"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-muted/60 border border-transparent text-sm focus:bg-card focus:border-border outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-9 h-9 rounded-full hover:bg-muted items-center justify-center relative" aria-label="Notifications">
              <Bell className="w-4 h-4 text-foreground" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shadow-sm">
                {initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold truncate">{profile?.full_name || "Passenger"}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{profile?.passenger_id}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/dashboard")}><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/smart-card")}><CreditCard className="w-4 h-4 mr-2" />Smart Card</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/profile")}><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); nav("/"); }}>
                  <LogOut className="w-4 h-4 mr-2" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/70 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-16">
          {mobileTabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}