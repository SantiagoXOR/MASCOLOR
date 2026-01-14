"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "Nuevo",
    className: "bg-info text-info-foreground hover:bg-info/90",
  },
  contacted: {
    label: "Contactado",
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  qualified: {
    label: "Calificado",
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  proposal: {
    label: "Propuesta",
    className: "bg-chart-5 text-primary-foreground hover:bg-chart-5/90",
  },
  won: {
    label: "Ganado",
    className: "bg-success text-success-foreground hover:bg-success/90",
  },
  lost: {
    label: "Perdido",
    className: "bg-muted-foreground text-muted hover:bg-muted-foreground/90",
  },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
