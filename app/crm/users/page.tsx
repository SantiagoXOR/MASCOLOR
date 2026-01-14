"use client";

import { Header } from "@/components/crm/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { mockUsers } from "@/data/crm/mockData";

export default function UsersPage() {
  return (
    <div>
      <Header title="Usuarios" subtitle="Gestiona los usuarios y agentes del sistema" />
      <div className="space-y-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Gestión de usuarios - En desarrollo
            </p>
            <div className="mt-4 space-y-2">
              {mockUsers.map((user) => (
                <div key={user.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Rol: {user.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
