import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">403 — Unauthorized</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to access this area.</p>
        <Link to="/"><Button className="rounded-full">Back to home</Button></Link>
      </div>
    </div>
  );
}