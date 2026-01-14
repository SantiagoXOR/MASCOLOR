"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle2 } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  fields: {
    name: string;
    label: string;
    type: "text" | "select";
    placeholder: string;
    options?: { value: string; label: string }[];
  }[];
  onConnect: () => void;
  onSave: () => void;
}

export function IntegrationCard({
  name,
  description,
  icon,
  isConnected,
  fields,
  onConnect,
  onSave,
}: IntegrationCardProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              isConnected
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <X className="h-3 w-3 mr-1" />
                Desconectado
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "select" ? (
              <Select>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onConnect}>
            Conectar
          </Button>
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
