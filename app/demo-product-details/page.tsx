"use client";

import { useState } from "react";
import { ProductDetailModal } from "@/components/ui/product-detail-modal";
import { useProductDetailModal } from "@/hooks/useProductDetailModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Eye, ExternalLink } from "lucide-react";

// IDs de productos de ejemplo para probar
const DEMO_PRODUCTS = [
  {
    id: "b817e62f-8bdd-4944-832f-e79a7b39bcc0",
    name: "Pegamento para Porcelanato",
    slug: "pegamento-para-porcelanato",
  },
  {
    id: "8af48d3d-b6a7-4843-bde9-519a30d4a288",
    name: "Pegamento para Cerámico",
    slug: "pegamento-para-ceramico",
  },
  {
    id: "3662ae62-73ed-4f41-8f0b-b2e9742037fd",
    name: "Revoque Fino",
    slug: "revoque-fino",
  },
];

export default function DemoProductDetailsPage() {
  const {
    isOpen: isModalOpen,
    productId: modalProductId,
    openModal,
    closeModal,
    navigateToProduct,
  } = useProductDetailModal();

  // const [selectedProductId, setSelectedProductId] = useState<string>("");

  const handleOpenModal = (productId: string) => {
    openModal(productId);
  };

  const handleOpenBySlug = (slug: string) => {
    openModal(undefined, slug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-mascolor-primary hover:text-mascolor-primary/80 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-xl font-bold text-mascolor-dark">
              Demo - Detalles de Productos
            </h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mascolor-dark">
                🧪 Demostración de Funcionalidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-mascolor-gray-600">
                Esta página permite probar la funcionalidad completa de
                &quot;Ver detalles&quot; de productos. Incluye:
              </p>
              <ul className="list-disc list-inside space-y-2 text-mascolor-gray-600">
                <li>Modal de detalles con información completa del producto</li>
                <li>Características técnicas y especificaciones</li>
                <li>Productos relacionados</li>
                <li>Funcionalidad de compartir</li>
                <li>Integración con WhatsApp</li>
                <li>Navegación entre productos</li>
                <li>Páginas individuales de productos (SEO)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Pruebas de Modal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mascolor-dark flex items-center">
                <Eye className="mr-2" size={20} />
                Probar Modal de Detalles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-mascolor-dark">
                      {product.name}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleOpenModal(product.id)}
                        className="w-full bg-mascolor-primary hover:bg-mascolor-primary/90"
                        size="sm"
                      >
                        Abrir por ID
                      </Button>
                      <Button
                        onClick={() => handleOpenBySlug(product.slug)}
                        variant="outline"
                        className="w-full border-mascolor-primary text-mascolor-primary hover:bg-mascolor-primary hover:text-white"
                        size="sm"
                      >
                        Abrir por Slug
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pruebas de Páginas Individuales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mascolor-dark flex items-center">
                <ExternalLink className="mr-2" size={20} />
                Probar Páginas Individuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mascolor-gray-600 mb-4">
                Las páginas individuales son útiles para SEO y permiten
                compartir enlaces directos a productos específicos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-mascolor-dark">
                      {product.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      /productos/{product.slug}
                    </Badge>
                    <Link href={`/productos/${product.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full border-mascolor-primary text-mascolor-primary hover:bg-mascolor-primary hover:text-white"
                        size="sm"
                      >
                        Ver página completa
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades Implementadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mascolor-dark">
                ✅ Funcionalidades Implementadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-mascolor-dark mb-3">
                    Modal de Detalles
                  </h4>
                  <ul className="space-y-1 text-sm text-mascolor-gray-600">
                    <li>• Información completa del producto</li>
                    <li>• Especificaciones técnicas</li>
                    <li>• Características detalladas</li>
                    <li>• Imagen optimizada</li>
                    <li>• Logo de marca</li>
                    <li>• Badges y categorías</li>
                    <li>• Productos relacionados</li>
                    <li>• Navegación entre productos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-mascolor-dark mb-3">
                    Funciones de Acción
                  </h4>
                  <ul className="space-y-1 text-sm text-mascolor-gray-600">
                    <li>• Compartir producto (Web Share API)</li>
                    <li>• Fallback a copiar enlace</li>
                    <li>• Contacto por WhatsApp</li>
                    <li>• Mensaje personalizado</li>
                    <li>• Cerrar con Escape</li>
                    <li>• Cerrar al hacer clic fuera</li>
                    <li>• Animaciones suaves</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Técnica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mascolor-dark">
                🔧 Información Técnica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-mascolor-dark mb-2">
                  Hooks Personalizados
                </h4>
                <ul className="text-sm text-mascolor-gray-600 space-y-1">
                  <li>
                    • <code>useProductDetails</code> - Obtener producto por ID o
                    slug
                  </li>
                  <li>
                    • <code>useRelatedProducts</code> - Productos relacionados
                  </li>
                  <li>
                    • <code>useProductDetailModal</code> - Estado del modal
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-mascolor-dark mb-2">
                  Servicios de Base de Datos
                </h4>
                <ul className="text-sm text-mascolor-gray-600 space-y-1">
                  <li>
                    • <code>getProductById</code> - Obtener producto con
                    relaciones
                  </li>
                  <li>
                    • <code>getProductBySlug</code> - Obtener producto por slug
                  </li>
                  <li>• Incluye características, categoría y marca</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-mascolor-dark mb-2">
                  Utilidades de Compartir
                </h4>
                <ul className="text-sm text-mascolor-gray-600 space-y-1">
                  <li>
                    • <code>shareProduct</code> - Compartir con Web Share API
                  </li>
                  <li>
                    • <code>openWhatsAppContact</code> - Abrir WhatsApp
                  </li>
                  <li>
                    • <code>generateSocialShareUrl</code> - URLs para redes
                    sociales
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de detalles */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        productId={modalProductId || undefined}
        onNavigateToProduct={navigateToProduct}
      />
    </div>
  );
}
