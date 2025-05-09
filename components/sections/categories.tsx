"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubtleButton } from "@/components/ui/subtle-button";
import { Paintbrush, Home, Building, Droplet, Plus } from "lucide-react";

const categories = [
  {
    id: "especiales",
    title: "Especiales",
    description:
      "Soluciones para piscinas, pisos deportivos y superficies con requerimientos específicos",
    icon: <Droplet className="w-6 h-6" />,
    color: "bg-mascolor-pink-400 text-mascolor-pink-800",
    image: "/images/backgrounds/ESPECIALES.jpg",
  },
  {
    id: "exteriores",
    title: "Para Exteriores",
    description:
      "Pinturas y revestimientos de alta resistencia a la intemperie, rayos UV y condiciones climáticas extremas",
    icon: <Building className="w-6 h-6" />,
    color: "bg-mascolor-pink-200 text-mascolor-pink-800",
    image: "/images/backgrounds/EXTERIORES.jpg",
  },
  {
    id: "interiores",
    title: "Para Interiores",
    description:
      "Pinturas decorativas para paredes y techos con acabados perfectos y colores duraderos",
    icon: <Home className="w-6 h-6" />,
    color: "bg-mascolor-pink-100 text-mascolor-pink-800",
    image: "/images/backgrounds/INTERIORES.jpg",
  },
  {
    id: "recubrimientos",
    title: "Recubrimientos",
    description:
      "Texturas, acabados especiales y soluciones para revestir superficies con materiales de alta calidad",
    icon: <Paintbrush className="w-6 h-6" />,
    color: "bg-mascolor-pink-300 text-mascolor-pink-800",
    image: "/images/backgrounds/RECUBRIMIENTOS.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-mascolor-dark mb-4">
            Elegí el producto{" "}
            <span className="text-mascolor-primary">indicado</span> para tu
            proyecto
          </h2>
          <p className="text-mascolor-gray-600 max-w-2xl mx-auto">
            Explora nuestras categorías de productos y encuentra la solución
            perfecta para cada superficie
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={`#productos?categoria=${category.id}`} scroll={false}>
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl group border border-mascolor-gray-200 hover:border-mascolor-primary/30 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mascolor-dark/80 via-mascolor-dark/30 to-transparent flex items-end justify-center p-4">
                      <div className="text-white text-center mb-2">
                        <div className="bg-mascolor-primary/80 p-2 rounded-full inline-block mb-2">
                          {category.icon}
                        </div>
                        <div className="text-lg font-medium">
                          {category.title}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <p className="text-mascolor-gray-600 text-center mb-4">
                      {category.description}
                    </p>
                    <div className="flex justify-center mt-auto">
                      <SubtleButton
                        className="text-xs px-3 py-1.5 hover:bg-mascolor-primary/10 text-center w-full"
                        icon={
                          <Plus className="h-3.5 w-3.5 stroke-current transition-all duration-300" />
                        }
                        href={`#productos?categoria=${category.id}`}
                        disableLink={true} // Desactivamos el Link interno para evitar anidación
                        onClick={(e) => {
                          e.preventDefault();

                          // Primero, desplazarse a la sección de productos
                          const productosSection =
                            document.getElementById("productos");
                          if (productosSection) {
                            productosSection.scrollIntoView({
                              behavior: "smooth",
                            });
                          }

                          // Luego, activar la pestaña correspondiente
                          setTimeout(() => {
                            // Buscar el elemento de pestaña por su atributo data-value
                            const tabElement = document.querySelector(
                              `[data-value="${category.id}"]`
                            );

                            if (tabElement) {
                              // Simular un clic en la pestaña
                              (tabElement as HTMLElement).click();

                              // Añadir una clase visual para indicar que está seleccionada
                              document
                                .querySelectorAll("[data-value]")
                                .forEach((tab) => {
                                  tab.classList.remove("tab-selected");
                                });
                              tabElement.classList.add("tab-selected");

                              console.log(
                                `Activada la pestaña: ${category.id}`
                              );
                            } else {
                              console.error(
                                `No se encontró la pestaña con id: ${category.id}`
                              );
                            }
                          }, 600); // Pequeño retraso para asegurar que el scroll haya terminado
                        }}
                      >
                        Ver productos
                      </SubtleButton>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
