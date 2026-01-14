"use client";

import { Header } from "@/components/crm/layout/Header";
import { MetricCard } from "@/components/crm/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeadStatusBadge } from "@/components/crm/leads/LeadStatusBadge";
import { SourceBadge } from "@/components/crm/leads/SourceBadge";
import { mockLeads } from "@/data/crm/mockData";
import { Users, UserPlus, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const sourceData = [
  { name: "WhatsApp", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Formulario", value: 35, color: "hsl(320, 100%, 27%)" },
  { name: "Website", value: 20, color: "hsl(217, 91%, 60%)" },
];

const statusData = [
  { name: "Nuevo", value: 24, fill: "hsl(217, 91%, 60%)" },
  { name: "Contactado", value: 18, fill: "hsl(38, 92%, 50%)" },
  { name: "Calificado", value: 12, fill: "hsl(320, 100%, 27%)" },
  { name: "Propuesta", value: 8, fill: "hsl(25, 95%, 53%)" },
  { name: "Ganado", value: 15, fill: "hsl(142, 76%, 36%)" },
  { name: "Perdido", value: 6, fill: "hsl(0, 0%, 45%)" },
];

const trendData = [
  { day: "01", leads: 4 },
  { day: "05", leads: 8 },
  { day: "10", leads: 6 },
  { day: "15", leads: 12 },
  { day: "20", leads: 9 },
  { day: "25", leads: 15 },
  { day: "30", leads: 11 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CrmDashboard() {
  const recentLeads = mockLeads.slice(0, 5);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Hace menos de 1 hora";
    if (hours < 24) return `Hace ${hours} horas`;
    if (days === 1) return "Ayer";
    return `Hace ${days} días`;
  };

  return (
    <div>
      <Header title="Dashboard" subtitle="Resumen general del CRM" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <MetricCard
            title="Total de Leads"
            value="156"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Leads Nuevos (Hoy)"
            value="8"
            icon={UserPlus}
            trend={{ value: 23, isPositive: true }}
          />
          <MetricCard
            title="Tasa de Conversión"
            value="18.5%"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Tiempo de Respuesta"
            value="2.5h"
            icon={Clock}
            description="Promedio"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Source Chart */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-heading">
                  Leads por Fuente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-4">
                  {sourceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Chart */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-heading">
                  Leads por Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={statusData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trend Chart */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-heading">
                  Tendencia (30 días)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="hsl(320, 100%, 27%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(320, 100%, 27%)", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Leads */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-heading">
                Leads Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/crm/leads" className="flex items-center gap-1">
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${lead.name}`}
                        />
                        <AvatarFallback>
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <SourceBadge source={lead.source} />
                      <LeadStatusBadge status={lead.status} />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(lead.lastActivity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
