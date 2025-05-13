"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePathDebug } from "@/components/debug/ImagePathDebug";

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState("images");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Herramientas de Depuración</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <ImagePathDebug />
        </TabsContent>

        <TabsContent value="products">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Depuración de Productos</h2>
            <p>Herramientas de depuración para productos (en desarrollo)</p>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Depuración de Base de Datos</h2>
            <p>Herramientas de depuración para la base de datos (en desarrollo)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
