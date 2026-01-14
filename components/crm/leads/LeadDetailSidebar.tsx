"use client";

import { Lead } from "@/types/crm/lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  RefreshCw, 
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { SourceBadge } from "./SourceBadge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface LeadDetailSidebarProps {
  lead: Lead;
}

export function LeadDetailSidebar({ lead }: LeadDetailSidebarProps) {
  const timeAgo = formatDistanceToNow(lead.lastActivity, { 
    addSuffix: true, 
    locale: es 
  });

  return (
    <div className="space-y-4 w-80">
      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Estado</p>
            <LeadStatusBadge status={lead.status} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Fuente</p>
            <SourceBadge source={lead.source} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Asignado a</p>
            <p className="font-medium">
              {lead.assignedTo?.name || "Sin asignar"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Creado</p>
            <p className="font-medium">{timeAgo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Última actividad</p>
            <p className="font-medium">{timeAgo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Enviar WhatsApp
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Cambiar Estado
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Reasignar
          </Button>
        </CardContent>
      </Card>

      {/* Automatizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automatizaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Respuesta automática WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Se activa al recibir mensaje
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Activa
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
