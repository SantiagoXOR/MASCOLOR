"use client";

import { BenefitsSection } from "@/components/sections/benefits";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";

export default function AboutPageClient() {
  return (
    <>
      <main>
        <div className="py-12 bg-mascolor-primary/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-mascolor-dark text-center">
              Sobre Nosotros
            </h1>
            <p className="text-lg text-center mt-4 max-w-2xl mx-auto">
              Conoce más sobre +COLOR, nuestra historia y valores.
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-mascolor-dark">Nuestra Historia</h2>
                <p className="text-gray-600 mb-4">
                  +COLOR nació en 2010 con una visión clara: revolucionar el mercado de pinturas y revestimientos 
                  ofreciendo productos de alta calidad a precios accesibles.
                </p>
                <p className="text-gray-600 mb-4">
                  Lo que comenzó como un pequeño emprendimiento familiar, hoy se ha convertido en una empresa 
                  líder en el sector, con presencia en todo el país y una amplia gama de productos para 
                  satisfacer las necesidades de profesionales y particulares.
                </p>
                <p className="text-gray-600 mb-6">
                  Nuestra pasión por la innovación y el compromiso con la calidad nos han permitido crecer 
                  y evolucionar, manteniendo siempre nuestros valores fundamentales.
                </p>
                <Button variant="color" asChild>
                  <Link href="/contacto">
                    Contáctanos
                  </Link>
                </Button>
              </div>
              <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Imagen de la empresa</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-mascolor-dark">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-mascolor-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-mascolor-primary text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-mascolor-dark">Calidad</h3>
                <p className="text-gray-600">
                  Nos comprometemos a ofrecer productos de la más alta calidad, sometidos a rigurosos 
                  controles y pruebas para garantizar su rendimiento y durabilidad.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-mascolor-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-mascolor-primary text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-mascolor-dark">Innovación</h3>
                <p className="text-gray-600">
                  Invertimos constantemente en investigación y desarrollo para crear productos innovadores 
                  que respondan a las necesidades cambiantes del mercado.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-mascolor-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-mascolor-primary text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-mascolor-dark">Sostenibilidad</h3>
                <p className="text-gray-600">
                  Estamos comprometidos con el medio ambiente, desarrollando productos eco-amigables 
                  y procesos de producción sostenibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        <BenefitsSection />
      </main>
      <Footer />
    </>
  );
}
