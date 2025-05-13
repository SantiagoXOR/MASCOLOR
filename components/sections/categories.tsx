"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Droplet,
  Home,
  Building,
  Layers,
  Paintbrush,
  ArrowRight,
} from "lucide-react";
import { useCategoryDetails } from "@/hooks/useCategoryDetails";

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
  // Obtener categorías con detalles desde Supabase
  const { categories, loading, error } = useCategoryDetails();

  // Función para manejar el clic en una categoría
  const handleCategoryClick = (category) => {
    console.log(`Navegando a la categoría: ${category.slug}`);

    // 1. Actualizar la URL con el hash correcto
    window.location.hash = `productos?categoria=${category.slug}`;

    // 2. Desplazarse a la sección de productos
    const productosSection = document.getElementById("productos");
    if (productosSection) {
      productosSection.scrollIntoView({
        behavior: "smooth",
      });
    }

    // 3. Asegurarnos de que el filtro esté en "category"
    // Buscar el botón de categoría por su ID y hacer clic en él si no está activo
    const categoryFilterButton = document.getElementById(
      "filter-by-category-button"
    );

    if (categoryFilterButton) {
      // Verificar si ya está activo (tiene la clase que indica selección)
      const isActive = categoryFilterButton.classList.contains(
        "bg-mascolor-primary"
      );

      if (!isActive) {
        console.log("Activando filtro por categoría");
        (categoryFilterButton as HTMLElement).click();
      }
    } else {
      console.log(
        "No se encontró el botón de filtro por categoría por ID, buscando por texto"
      );

      // Método alternativo: buscar por texto
      const buttonByText = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent?.includes("Por Categoría")
      );

      if (buttonByText) {
        const isActive = buttonByText.classList.contains("bg-mascolor-primary");

        if (!isActive) {
          console.log("Activando filtro por categoría (encontrado por texto)");
          (buttonByText as HTMLElement).click();
        }
      }
    }

    // 4. Esperar a que se actualice el DOM y activar la pestaña correcta
    setTimeout(() => {
      // Intentar diferentes selectores para encontrar la pestaña
      const selectors = [
        `#tab-category-${category.slug}`,
        `[data-category-tab="${category.slug}"]`,
        `[data-value="${category.slug}"]`,
        `[value="${category.slug}"]`,
        `button[value="${category.slug}"]`,
        `[role="tab"][value="${category.slug}"]`,
      ];

      let tabElement = null;

      // Probar cada selector hasta encontrar uno que funcione
      for (const selector of selectors) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            tabElement = element;
            console.log(`Pestaña encontrada con selector: ${selector}`);
            break;
          }
        } catch (error) {
          console.log(`Error con selector ${selector}:`, error);
        }
      }

      // Si encontramos la pestaña, hacer clic en ella
      if (tabElement) {
        console.log(`Activando pestaña para: ${category.slug}`);
        (tabElement as HTMLElement).click();
      } else {
        console.error(`No se encontró la pestaña para: ${category.slug}`);

        // Último recurso: buscar todos los elementos que podrían ser pestañas
        const allTabs = document.querySelectorAll('[role="tab"]');
        console.log(`Encontradas ${allTabs.length} pestañas en total`);

        // Buscar por texto contenido
        const tabByText = Array.from(allTabs).find((tab) =>
          tab.textContent?.toLowerCase().includes(category.name.toLowerCase())
        );

        if (tabByText) {
          console.log(`Pestaña encontrada por texto: ${category.name}`);
          (tabByText as HTMLElement).click();
        } else {
          console.error(
            `No se pudo encontrar ninguna pestaña para: ${category.slug}`
          );
        }
      }
    }, 800);
  };

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

        {loading ? (
          // Mostrar esqueletos de carga mientras se cargan las categorías
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-56 rounded-t-lg"></div>
                  <div className="bg-gray-100 p-5 rounded-b-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          // Mostrar mensaje de error si hay un problema
          <div className="text-center text-red-500">
            <p>Error al cargar las categorías: {error.message}</p>
          </div>
        ) : (
          // Mostrar las categorías cuando estén cargadas
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Card
                  className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl group border border-mascolor-gray-200 hover:border-mascolor-primary/30 flex flex-col cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mascolor-dark/80 via-mascolor-dark/30 to-transparent flex items-end justify-center p-4">
                      <div className="text-white text-center mb-2">
                        <div className="bg-mascolor-primary/80 p-2 rounded-full inline-block mb-2">
                          {category.iconName === "Droplet" && (
                            <Droplet className="w-6 h-6" />
                          )}
                          {category.iconName === "Building" && (
                            <Building className="w-6 h-6" />
                          )}
                          {category.iconName === "Home" && (
                            <Home className="w-6 h-6" />
                          )}
                          {category.iconName === "Layers" && (
                            <Layers className="w-6 h-6" />
                          )}
                          {category.iconName === "Paintbrush" && (
                            <Paintbrush className="w-6 h-6" />
                          )}
                        </div>
                        <div className="text-lg font-medium">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <p className="text-mascolor-gray-600 text-center">
                      {category.description ||
                        "Explora nuestra selección de productos en esta categoría"}
                    </p>
                    <div className="flex justify-center items-center mt-4">
                      <span className="text-mascolor-primary text-sm font-medium flex items-center gap-1 hover:underline">
                        Ver productos
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
