"use client";

import { Header } from "@/components/crm/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/data/crm/mockData";
import { UserCard } from "@/components/crm/users/UserCard";
import { Users, UserPlus } from "lucide-react";

export default function UsersPage() {
  const totalUsers = mockUsers.length;

  return (
    <div>
      <Header title="Usuarios" subtitle="Gestiona los usuarios y agentes del sistema" />
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="flex items-center justify-between">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Usuarios totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </Button>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
