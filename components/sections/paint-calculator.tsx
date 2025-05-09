"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Building,
  Droplet,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  MessageCircle,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Categorías de productos
const productCategories = [
  { id: "interior", name: "Interior", icon: <Home size={16} /> },
  { id: "exterior", name: "Exterior", icon: <Building size={16} /> },
  { id: "techos", name: "Techos", icon: <Droplet size={16} /> },
];

// Datos de productos con sus rendimientos
const paintProducts = [
  // Interiores
  {
    id: "latex-interior",
    name: "Látex Interior",
    category: "interior",
    coverage: 12, // m² por litro
    image: "/images/products/PREMIUM-LATEXINT.png",
    icon: <Home size={16} />,
    brand: "premium",
    coats: 2,
  },
  {
    id: "latex-lavable",
    name: "Látex Lavable",
    category: "interior",
    coverage: 11, // m² por litro
    image: "/images/products/PREMIUM-LAVABLE.png",
    icon: <Home size={16} />,
    brand: "premium",
    coats: 2,
  },

  // Exteriores
  {
    id: "latex-exterior",
    name: "Látex Exterior",
    category: "exterior",
    coverage: 10, // m² por litro
    image: "/images/products/PREMIUM-LATEXEXT.png",
    icon: <Building size={16} />,
    brand: "premium",
    coats: 2,
  },
  {
    id: "frentes",
    name: "Frentes Impermeabilizantes",
    category: "exterior",
    coverage: 8, // m² por litro
    image: "/images/products/PREMIUM-FRENTESIMPERMEABILIZANTES.png",
    icon: <Building size={16} />,
    brand: "premium",
    coats: 2,
  },

  // Techos
  {
    id: "membrana",
    name: "Membrana Líquida",
    category: "techos",
    coverage: 1.5, // m² por litro (más espesa)
    image: "/images/products/PREMIUM-MEMBRANA-1.png",
    icon: <Droplet size={16} />,
    brand: "premium",
    coats: 3,
  },
];

export function PaintCalculator() {
  const [activeCategory, setActiveCategory] = useState<string>("interior");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [surface, setSurface] = useState<number>(50);
  const [coats, setCoats] = useState<number>(2);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    liters: number;
    bucketSize: number;
    bucketCount: number;
    recommendation: string;
  } | null>(null);

  // Filtrar productos por categoría
  const filteredProducts = paintProducts.filter(
    (product) => product.category === activeCategory
  );

  // Resetear el error cuando cambian los inputs
  useEffect(() => {
    setError(null);
  }, [selectedProduct, surface, coats]);

  // Resetear la selección de producto al cambiar de categoría
  useEffect(() => {
    setSelectedProduct("");
  }, [activeCategory]);

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (currentStep === 1 && !selectedProduct) {
      setError("Por favor, seleccioná un producto");
      return;
    }

    if (currentStep === 2 && (isNaN(surface) || surface <= 0)) {
      setError("Por favor, ingresá una superficie válida");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      calculatePaint();
    }
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const calculatePaint = () => {
    // Validar inputs
    if (!selectedProduct) {
      setError("Por favor, seleccioná un producto");
      setCurrentStep(1);
      return;
    }

    if (isNaN(surface) || surface <= 0) {
      setError("Por favor, ingresá una superficie válida");
      setCurrentStep(2);
      return;
    }

    // Encontrar el producto seleccionado
    const product = paintProducts.find((p) => p.id === selectedProduct);

    if (!product) {
      setError("Producto no encontrado");
      return;
    }

    // Calcular litros necesarios
    const litersNeeded = (surface / product.coverage) * coats;

    // Determinar tamaño de baldes y cantidad
    let bucketSize = 20; // Tamaño predeterminado en litros

    if (litersNeeded <= 4) {
      bucketSize = 4;
    } else if (litersNeeded <= 10) {
      bucketSize = 10;
    }

    // Calcular cantidad de baldes necesarios
    const bucketCount = Math.ceil(litersNeeded / bucketSize);

    // Generar recomendación
    let recommendation = `Recomendamos dar ${coats} manos para un mejor resultado.`;

    if (product.category === "techos") {
      recommendation +=
        " Para techos, es crucial aplicar el espesor recomendado.";
    }

    // Guardar resultados
    setResult({
      liters: Math.ceil(litersNeeded),
      bucketSize,
      bucketCount,
      recommendation,
    });

    setShowResult(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-md border border-gray-100 overflow-hidden">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-2xl text-center text-mascolor-dark">
                  Calculá tu pintura en 3 pasos
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Pasos numerados */}
                <div className="flex justify-between mb-6 px-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex flex-col items-center ${
                        currentStep === step ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          currentStep === step
                            ? "bg-mascolor-primary text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step === 1
                          ? "Producto"
                          : step === 2
                          ? "Superficie"
                          : "Manos"}
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Paso 1: Selección de producto */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium text-mascolor-dark">
                        ¿Qué vas a pintar?
                      </h3>

                      {/* Tabs de categorías */}
                      <Tabs
                        defaultValue={activeCategory}
                        onValueChange={setActiveCategory}
                        className="w-full"
                      >
                        <TabsList className="w-full mb-4 grid grid-cols-3">
                          {productCategories.map((category) => (
                            <TabsTrigger
                              key={category.id}
                              value={category.id}
                              className="flex items-center gap-1.5"
                            >
                              <span className="hidden sm:inline-block">
                                {category.icon}
                              </span>
                              <span>{category.name}</span>
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {productCategories.map((category) => (
                          <TabsContent
                            key={category.id}
                            value={category.id}
                            className="mt-0"
                          >
                            <div className="grid grid-cols-1 gap-2">
                              {paintProducts
                                .filter(
                                  (product) => product.category === category.id
                                )
                                .map((product) => (
                                  <motion.div
                                    key={product.id}
                                    className={`relative p-3 rounded-md border cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                                      selectedProduct === product.id
                                        ? "border-mascolor-primary bg-mascolor-pink-50"
                                        : "border-gray-200 hover:border-mascolor-primary/30"
                                    }`}
                                    onClick={() =>
                                      setSelectedProduct(product.id)
                                    }
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                      <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        onError={(e) => {
                                          // Fallback a una imagen de placeholder si hay error
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.src =
                                            "/images/products/placeholder.jpg";
                                        }}
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">
                                          {product.name}
                                        </h4>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                          <span
                                            title={`Rinde ${product.coverage} m² por litro por mano`}
                                          >
                                            {product.coverage} m²/L
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {selectedProduct === product.id && (
                                      <CheckCircle2
                                        size={16}
                                        className="text-mascolor-primary"
                                      />
                                    )}
                                  </motion.div>
                                ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>

                      {error && (
                        <motion.p
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle size={14} /> {error}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  {/* Paso 2: Superficie */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium text-mascolor-dark">
                        🧱 ¿Cuántos m² necesitás cubrir?
                      </h3>

                      <div className="flex items-end gap-2">
                        <div className="flex-grow">
                          <Input
                            type="number"
                            min="1"
                            max="500"
                            value={surface}
                            onChange={(e) =>
                              setSurface(parseInt(e.target.value) || 0)
                            }
                            className="text-lg h-12 text-center font-medium"
                          />
                        </div>
                        <div className="text-lg font-medium text-gray-500">
                          m²
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle size={14} /> {error}
                        </motion.p>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        <p>
                          Ingresá la superficie total a pintar en metros
                          cuadrados.
                        </p>
                        <p className="mt-1">Rango válido: 1-500 m²</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Paso 3: Manos de pintura */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium text-mascolor-dark">
                        🖌️ ¿Cuántas manos vas a aplicar?
                      </h3>

                      <div className="flex justify-center gap-4">
                        {[1, 2, 3].map((num) => (
                          <motion.button
                            key={num}
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              coats === num
                                ? "bg-mascolor-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setCoats(num)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>

                      <div className="text-center text-sm text-gray-600 mt-2">
                        {coats === 1
                          ? "Una mano suele ser insuficiente para la mayoría de superficies."
                          : coats === 2
                          ? "Dos manos es lo recomendado para la mayoría de pinturas."
                          : "Tres manos aseguran una cobertura perfecta, especialmente en colores intensos."}
                      </div>

                      {error && (
                        <motion.p
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle size={14} /> {error}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botones de navegación */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="px-4"
                    >
                      Anterior
                    </Button>
                  ) : (
                    <div></div> // Espacio vacío para mantener el flex justify-between
                  )}

                  {currentStep < 3 ? (
                    <Button variant="color" onClick={nextStep} className="px-6">
                      Siguiente
                    </Button>
                  ) : (
                    <Button
                      variant="color"
                      onClick={calculatePaint}
                      className="px-6"
                    >
                      Calcular cantidad
                    </Button>
                  )}
                </div>

                {/* Resultado modal */}
                <AnimatePresence>
                  {showResult && result && (
                    <motion.div
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowResult(false)}
                    >
                      <motion.div
                        className="bg-white rounded-lg max-w-md w-full p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-mascolor-dark">
                            Resultado
                          </h3>

                          <div className="flex justify-center my-6">
                            <div className="relative w-16 h-16">
                              {selectedProduct && (
                                <Image
                                  src={
                                    paintProducts.find(
                                      (p) => p.id === selectedProduct
                                    )?.image || ""
                                  }
                                  alt="Producto"
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>
                          </div>

                          <p className="text-2xl font-bold text-mascolor-primary mt-2">
                            Vas a necesitar {result.liters} litros
                          </p>
                          <p className="text-lg text-gray-700 mt-1">
                            ({result.bucketCount}{" "}
                            {result.bucketCount === 1 ? "lata" : "latas"} de{" "}
                            {result.bucketSize}L)
                          </p>

                          <p className="text-sm text-gray-600 mt-4">
                            {result.recommendation}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-6">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowResult(false)}
                          >
                            Cerrar
                          </Button>

                          <Button
                            variant="color"
                            className="flex-1 gap-1"
                            asChild
                          >
                            <Link
                              href={`#productos?categoria=${activeCategory}`}
                            >
                              <ShoppingCart size={16} />
                              Ver producto
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
