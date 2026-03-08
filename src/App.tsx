import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import HomePage from "./pages/HomePage";
import JourneyPlannerPage from "./pages/JourneyPlannerPage";
import StationsPage from "./pages/StationsPage";
import TimingsPage from "./pages/TimingsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import TrackComplaintPage from "./pages/TrackComplaintPage";
import AlertsPage from "./pages/AlertsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey-planner" element={<JourneyPlannerPage />} />
              <Route path="/stations" element={<StationsPage />} />
              <Route path="/timings" element={<TimingsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/track-complaint" element={<TrackComplaintPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
