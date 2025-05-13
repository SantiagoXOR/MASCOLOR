"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useDebug } from "@/contexts/DebugContext";

export function ProductImageDebugger() {
  const { isDebugEnabled, activeDebuggers } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({});
  const [formatTests, setFormatTests] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Obtener todos los productos
  const { products, loading, error } = useProducts();

  // Seleccionar el primer producto por defecto cuando se cargan
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Producto seleccionado
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || null;

  // Probar diferentes formatos de imagen para el producto seleccionado
  useEffect(() => {
    if (!selectedProduct || !isOpen) return;

    const testFormats = async () => {
      const formats = ["webp", "jpg", "png", "avif"];
      const results: Record<string, boolean> = {};

      // Probar imagen original
      try {
        const originalStatus = await testImage(selectedProduct.image_url);
        setImageStatus((prev) => ({
          ...prev,
          original: originalStatus ? "success" : "error",
        }));
      } catch (error) {
        setImageStatus((prev) => ({ ...prev, original: "error" }));
      }

      // Si tiene asset_id, probar diferentes formatos
      if (selectedProduct.asset_id) {
        for (const format of formats) {
          const url = `/assets/images/products/${selectedProduct.asset_id}/original.${format}`;
          try {
            results[format] = await testImage(url);
          } catch (error) {
            results[format] = false;
          }
        }

        // Probar también el placeholder
        try {
          results["placeholder"] = await testImage(
            `/assets/images/products/${selectedProduct.asset_id}/placeholder.webp`
          );
        } catch (error) {
          results["placeholder"] = false;
        }

        setFormatTests((prev) => ({
          ...prev,
          [selectedProduct.id]: results,
        }));
      }
    };

    testFormats();
  }, [selectedProduct, isOpen]);

  // Función para probar si una imagen se carga correctamente
  const testImage = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("images")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        {isOpen ? "Cerrar Debugger" : "Product Image Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-[500px] max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              Depuración de Imágenes de Productos
            </h3>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {products.length} productos
            </span>
          </div>

          {loading ? (
            <div className="text-center py-4">Cargando productos...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error: {error.message}
            </div>
          ) : (
            <Tabs defaultValue="products">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="products" className="flex-1">
                  Productos
                </TabsTrigger>
                <TabsTrigger value="formats" className="flex-1">
                  Formatos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <div className="grid grid-cols-2 gap-2 mb-4 max-h-40 overflow-y-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      className={`text-left p-2 text-xs rounded ${
                        selectedProductId === product.id
                          ? "bg-purple-100 border border-purple-300"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-gray-500 truncate">
                        {product.brand?.name}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProduct && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {selectedProduct.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Información</h4>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-medium">ID:</span>{" "}
                              {selectedProduct.id}
                            </div>
                            <div>
                              <span className="font-medium">Categoría:</span>{" "}
                              {selectedProduct.category?.name}
                            </div>
                            <div>
                              <span className="font-medium">Marca:</span>{" "}
                              {selectedProduct.brand?.name}
                            </div>
                            <div>
                              <span className="font-medium">Asset ID:</span>{" "}
                              {selectedProduct.asset_id || "No tiene"}
                            </div>
                            <div className="break-all">
                              <span className="font-medium">URL:</span>{" "}
                              {selectedProduct.image_url}
                            </div>
                          </div>

                          <h4 className="font-medium mt-4 mb-2">
                            Rutas de imagen
                          </h4>
                          {selectedProduct.asset_id ? (
                            <div className="space-y-1 text-xs font-mono">
                              <div className="flex items-center">
                                <span
                                  className={`px-1.5 py-0.5 rounded mr-1 ${
                                    formatTests[selectedProduct.id]?.["webp"]
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  original.webp
                                </span>
                                <p className="break-all">
                                  /assets/images/products/
                                  {selectedProduct.asset_id}/original.webp
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`px-1.5 py-0.5 rounded mr-1 ${
                                    formatTests[selectedProduct.id]?.["jpg"]
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  original.jpg
                                </span>
                                <p className="break-all">
                                  /assets/images/products/
                                  {selectedProduct.asset_id}/original.jpg
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`px-1.5 py-0.5 rounded mr-1 ${
                                    formatTests[selectedProduct.id]?.[
                                      "placeholder"
                                    ]
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
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
                          <div
                            className="relative h-40 bg-gray-100 rounded overflow-hidden"
                            style={{ minHeight: "160px" }}
                          >
                            {selectedProduct.image_url ? (
                              <div
                                className="relative w-full h-full"
                                style={{ minHeight: "160px" }}
                              >
                                <Image
                                  src={selectedProduct.image_url}
                                  alt={selectedProduct.name}
                                  fill
                                  className="object-contain"
                                  onError={() => {
                                    setImageStatus((prev) => ({
                                      ...prev,
                                      preview: "error",
                                    }));
                                  }}
                                  onLoad={() => {
                                    setImageStatus((prev) => ({
                                      ...prev,
                                      preview: "success",
                                    }));
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Sin imagen</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 text-xs">
                            <div className="flex items-center">
                              <span
                                className={`w-2 h-2 rounded-full mr-1 ${
                                  imageStatus.preview === "success"
                                    ? "bg-green-500"
                                    : imageStatus.preview === "error"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>
                                {imageStatus.preview === "success"
                                  ? "Imagen cargada correctamente"
                                  : imageStatus.preview === "error"
                                  ? "Error al cargar la imagen"
                                  : "Cargando..."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="formats">
                <div className="text-sm mb-4">
                  <p>
                    Esta pestaña muestra qué formatos de imagen están
                    disponibles para cada producto.
                  </p>
                </div>

                <div className="space-y-2">
                  {products
                    .filter((p) => p.asset_id)
                    .map((product) => (
                      <div key={product.id} className="border rounded p-2">
                        <div className="font-medium text-sm mb-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Asset ID: {product.asset_id}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {["webp", "jpg", "png", "avif", "placeholder"].map(
                            (format) => (
                              <span
                                key={format}
                                className={`text-xs px-2 py-1 rounded ${
                                  formatTests[product.id]?.[
                                    format === "placeholder"
                                      ? "placeholder"
                                      : format
                                  ]
                                    ? "bg-green-100 text-green-800"
                                    : formatTests[product.id]
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {format}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
