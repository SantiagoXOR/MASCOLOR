import { LeadStatus } from "@/components/crm/leads/LeadStatusBadge";
import { LeadSource } from "@/components/crm/leads/SourceBadge";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

export interface Message {
  id: string;
  leadId: string;
  content: string;
  type: "inbound" | "outbound" | "note";
  channel: "whatsapp" | "email" | "internal";
  createdAt: Date;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent";
  avatar?: string;
  isActive: boolean;
  leadsCount: number;
}
