"use client";

import { Badge } from "@/components/ui/badge";
import { MessageCircle, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type LeadSource = "whatsapp" | "website" | "form";

const sourceConfig: Record<LeadSource, { label: string; icon: typeof MessageCircle; className: string }> = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  website: {
    label: "Website",
    icon: Globe,
    className: "bg-info/10 text-info border-info/20",
  },
  form: {
    label: "Formulario",
    icon: FileText,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const config = sourceConfig[source];
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={cn("gap-1", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
