"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/crm/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { mockLeads } from "@/data/crm/mockData";
import { LeadDetailTabs } from "@/components/crm/leads/LeadDetailTabs";
import { LeadDetailSidebar } from "@/components/crm/leads/LeadDetailSidebar";
import { LeadStatusBadge } from "@/components/crm/leads/LeadStatusBadge";
import { SourceBadge } from "@/components/crm/leads/SourceBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const lead = mockLeads.find((l) => l.id === leadId) || mockLeads[0];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <Header title={lead.name} subtitle="Detalle del lead" />
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/crm/leads" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Leads
          </Link>
        </Button>

        {/* Lead Header */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={lead.assignedTo?.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(lead.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{lead.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <SourceBadge source={lead.source} />
                    <LeadStatusBadge status={lead.status} />
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Sidebar */}
        <div className="flex gap-6">
          <div className="flex-1">
            <LeadDetailTabs lead={lead} />
          </div>
          <LeadDetailSidebar lead={lead} />
        </div>
      </div>
    </div>
  );
}
