import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey-planner" element={<JourneyPlannerPage />} />
          <Route path="/metro-map" element={<MetroMapPage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/timings" element={<TimingsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/track-complaint" element={<TrackComplaintPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/tourism" element={<TouristSpotsPage />} />
          <Route path="/smart-card" element={<SmartCardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
