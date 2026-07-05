import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth, RequireAdmin } from "@/components/guards";
import HomePage from "./pages/HomePage";
import JourneyPlannerPage from "./pages/JourneyPlannerPage";
import MetroMapPage from "./pages/MetroMapPage";
import StationsPage from "./pages/StationsPage";
import TimingsPage from "./pages/TimingsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import TrackComplaintPage from "./pages/TrackComplaintPage";
import AlertsPage from "./pages/AlertsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TouristSpotsPage from "./pages/TouristSpotsPage";
import SmartCardPage from "./pages/SmartCardPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");
  const isAuth = location.pathname === "/auth";
  const hideChrome = isAdminArea || isAuth;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/journey-planner" element={<JourneyPlannerPage />} />
          <Route path="/metro-map" element={<MetroMapPage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/timings" element={<TimingsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/tourism" element={<TouristSpotsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Passenger (protected) */}
          <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/smart-card" element={<RequireAuth><SmartCardPage /></RequireAuth>} />
          <Route path="/complaints" element={<RequireAuth><ComplaintsPage /></RequireAuth>} />
          <Route path="/track-complaint" element={<RequireAuth><TrackComplaintPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* Admin (hidden) */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
