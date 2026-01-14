"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Message, Lead } from "@/types/crm/lead";
import { mockMessages } from "@/data/crm/mockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Send, Mic, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeadDetailTabsProps {
  lead: Lead;
}

export function LeadDetailTabs({ lead }: LeadDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"conversaciones" | "informacion" | "historial" | "notas">("conversaciones");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"whatsapp" | "nota">("whatsapp");
  
  const messages = mockMessages.filter((m) => m.leadId === lead.id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a", { locale: es });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("conversaciones")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "conversaciones"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Conversaciones
        </button>
        <button
          onClick={() => setActiveTab("informacion")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "informacion"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Información
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "historial"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveTab("notas")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "notas"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Notas
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "conversaciones" && (
        <div className="space-y-4">
          {/* Messages */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.type === "outbound" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "inbound" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={lead.assignedTo?.avatar} />
                    <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex flex-col gap-1 max-w-[70%] ${
                    msg.type === "outbound" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.type === "outbound"
                        ? "bg-primary text-primary-foreground"
                        : msg.type === "note"
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.type === "outbound" && msg.author && (
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs opacity-80">IA</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                {msg.type === "outbound" && msg.author && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.author.avatar} />
                    <AvatarFallback>{getInitials(msg.author.name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <Card className="border-t">
            <CardContent className="p-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setMessageType("whatsapp")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    messageType === "whatsapp"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setMessageType("nota")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    messageType === "nota"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Nota Interna
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" variant="ghost">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="default">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "informacion" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
              <p className="font-medium">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estado</p>
              <p className="font-medium">{lead.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fuente</p>
              <p className="font-medium">{lead.source}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Creado</p>
              <p className="font-medium">
                {format(lead.createdAt, "dd MMM yyyy", { locale: es })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "historial" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Historial de actividades - En desarrollo</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "notas" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Notas internas - En desarrollo</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
