import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function FullscreenLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <FullscreenLoader />;
  if (!user) return <Navigate to={`/auth?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return children;
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <FullscreenLoader />;
  if (!user) return <Navigate to="/admin" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;
  return children;
}