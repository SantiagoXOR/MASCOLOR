"use client";

import { Header } from "@/components/crm/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Configuración" subtitle="Ajustes e integraciones del sistema" />
      <div className="space-y-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Configuración - En desarrollo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
