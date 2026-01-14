"use client";

import { useState } from "react";
import { Header } from "@/components/crm/layout/Header";
import { IntegrationCard } from "@/components/crm/settings/IntegrationCard";
import { MessageSquare, Mic } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"integraciones" | "automatizaciones" | "general">("integraciones");

  return (
    <div>
      <Header title="Configuración" subtitle="Ajustes e integraciones del sistema" />
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("integraciones")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "integraciones"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Integraciones
          </button>
          <button
            onClick={() => setActiveTab("automatizaciones")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "automatizaciones"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Automatizaciones
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "general"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            General
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "integraciones" && (
          <div className="space-y-6">
            <IntegrationCard
              name="UChat - WhatsApp API"
              description="Conecta tu cuenta de WhatsApp Business para gestionar mensajes"
              icon={
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              }
              isConnected={false}
              fields={[
                {
                  name: "apiKey",
                  label: "API Key",
                  type: "text",
                  placeholder: "Ingresa tu API Key de UChat",
                },
                {
                  name: "webhookSecret",
                  label: "Webhook Secret",
                  type: "text",
                  placeholder: "Ingresa tu Webhook Secret",
                },
                {
                  name: "phoneNumberId",
                  label: "Phone Number ID",
                  type: "text",
                  placeholder: "ID del número de teléfono",
                },
              ]}
              onConnect={() => console.log("Conectar UChat")}
              onSave={() => console.log("Guardar UChat")}
            />

            <IntegrationCard
              name="ElevenLabs - Voz IA"
              description="Genera respuestas de voz con inteligencia artificial"
              icon={
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
              }
              isConnected={false}
              fields={[
                {
                  name: "apiKey",
                  label: "API Key",
                  type: "text",
                  placeholder: "Ingresa tu API Key de ElevenLabs",
                },
                {
                  name: "voiceId",
                  label: "Voice ID",
                  type: "select",
                  placeholder: "Seleccionar voz",
                  options: [
                    { value: "voice1", label: "Voz Masculina 1" },
                    { value: "voice2", label: "Voz Femenina 1" },
                    { value: "voice3", label: "Voz Masculina 2" },
                    { value: "voice4", label: "Voz Femenina 2" },
                  ],
                },
              ]}
              onConnect={() => console.log("Conectar ElevenLabs")}
              onSave={() => console.log("Guardar ElevenLabs")}
            />
          </div>
        )}

        {activeTab === "automatizaciones" && (
          <div className="text-muted-foreground">
            Automatizaciones - En desarrollo
          </div>
        )}

        {activeTab === "general" && (
          <div className="text-muted-foreground">
            Configuración general - En desarrollo
          </div>
        )}
      </div>
    </div>
  );
}
