"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";

/**
 * Componente para depurar rutas de imágenes
 * Muestra información detallada sobre las rutas de imágenes y permite probar diferentes formatos
 */
export function ImagePathDebug() {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [testFormat, setTestFormat] = useState<string>("original.webp");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);

  // Seleccionar el primer producto cuando se cargan
  useEffect(() => {
    if (products && products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Función para probar una imagen
  const testImage = (url: string) => {
    return new Promise<boolean>((resolve) => {
      // Usar window.Image en lugar de Image para evitar errores de tipo
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Manejar la prueba de formato
  const handleTestFormat = async () => {
    if (!selectedProduct || !selectedProduct.asset_id) {
      setTestResult({
        success: false,
        message: "No hay producto seleccionado o no tiene asset_id",
      });
      return;
    }

    const url = `/assets/images/products/${selectedProduct.asset_id}/${testFormat}`;
    const success = await testImage(url);

    setTestResult({
      success,
      message: success
        ? `La imagen se cargó correctamente`
        : `Error al cargar la imagen`,
      url,
    });
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">
        Depuración de Rutas de Imágenes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lista de productos */}
        <div className="md:col-span-1 border rounded-lg p-2 h-[400px] overflow-y-auto">
          <h3 className="font-medium mb-2">Productos ({products.length})</h3>
          <div className="space-y-1">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-2 rounded cursor-pointer text-sm ${
                  selectedProduct?.id === product.id
                    ? "bg-mascolor-primary text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-xs opacity-80">
                  {product.asset_id
                    ? `✅ asset_id: ${product.asset_id.substring(0, 8)}...`
                    : "❌ Sin asset_id"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="md:col-span-2">
          {selectedProduct ? (
            <Tabs defaultValue="info">
              <TabsList className="mb-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="test">Prueba de Formatos</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {selectedProduct.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Datos del producto</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">ID:</span>{" "}
                            {selectedProduct.id}
                          </div>
                          <div>
                            <span className="font-medium">Nombre:</span>{" "}
                            {selectedProduct.name}
                          </div>
                          <div>
                            <span className="font-medium">Categoría:</span>{" "}
                            {selectedProduct.category?.name || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Marca:</span>{" "}
                            {selectedProduct.brand?.name || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Asset ID:</span>{" "}
                            {selectedProduct.asset_id || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">URL de imagen:</span>{" "}
                            <span className="font-mono text-xs break-all">
                              {selectedProduct.image_url}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-medium mt-4 mb-2">
                          Rutas de imagen
                        </h4>
                        {selectedProduct.asset_id ? (
                          <div className="space-y-1 text-xs font-mono">
                            <div className="flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded mr-1">
                                original.webp
                              </span>
                              <p className="break-all">
                                /assets/images/products/
                                {selectedProduct.asset_id}/original.webp
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded mr-1">
                                placeholder.webp
                              </span>
                              <p className="break-all">
                                /assets/images/products/
                                {selectedProduct.asset_id}/placeholder.webp
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-500 text-sm">
                            Este producto no tiene asset_id
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vista previa</h4>
                        <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                          {selectedProduct.image_url ? (
                            <Image
                              src={selectedProduct.image_url}
                              alt={selectedProduct.name}
                              fill
                              className="object-contain"
                              onError={() => {
                                console.error(
                                  "Error al cargar la imagen:",
                                  selectedProduct.image_url
                                );
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500">Sin imagen</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Prueba de formatos de imagen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProduct.asset_id ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <select
                            className="border rounded p-1.5 text-sm"
                            value={testFormat}
                            onChange={(e) => setTestFormat(e.target.value)}
                          >
                            <option value="original.webp">original.webp</option>
                            <option value="original.avif">original.avif</option>
                            <option value="original.jpg">original.jpg</option>
                            <option value="original.png">original.png</option>
                            <option value="placeholder.webp">
                              placeholder.webp
                            </option>
                            <option value="640.webp">640.webp</option>
                          </select>
                          <Button
                            size="sm"
                            onClick={handleTestFormat}
                            className="text-xs"
                          >
                            Probar
                          </Button>
                        </div>

                        {testResult && (
                          <div
                            className={`p-3 rounded text-sm ${
                              testResult.success
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                            }`}
                          >
                            <p className="font-medium">{testResult.message}</p>
                            {testResult.url && (
                              <p className="text-xs font-mono mt-1 break-all">
                                {testResult.url}
                              </p>
                            )}
                          </div>
                        )}

                        {testResult && testResult.success && testResult.url && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">
                              Vista previa del formato
                            </h4>
                            <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={testResult.url}
                                alt={`${selectedProduct.name} (${testFormat})`}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-red-500">
                        Este producto no tiene asset_id, no se pueden probar
                        formatos
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Selecciona un producto para ver detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
