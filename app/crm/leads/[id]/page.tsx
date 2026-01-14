"use client";

"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/crm/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockLeads } from "@/data/crm/mockData";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const lead = mockLeads.find((l) => l.id === leadId) || mockLeads[0];

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
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-medium">{lead.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuente</p>
                <p className="font-medium">{lead.source}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
