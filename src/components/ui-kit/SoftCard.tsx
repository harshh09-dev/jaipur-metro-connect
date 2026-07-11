import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SoftCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/60 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}