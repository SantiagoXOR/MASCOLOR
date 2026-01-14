"use client";

import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoItem } from "@/components/ui/bento";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
  HeartHandshake,
  Award,
  Timer,
  Users,
  Shield,
  Truck,
  Phone,
  Star
} from "lucide-react";

const benefits = [
  {
    icon: HeartHandshake,
    title: "Asesoramiento experto",
    description: "Te acompañamos en cada paso, con soluciones para profesionales, obras o proyectos del hogar.",
    color: "bg-blue-500",
    stats: "24/7"
  },
  {
    icon: Award,
    title: "Calidad garantizada",
    description: "Usamos materias primas de primera línea y procesos que aseguran acabados duraderos y perfectos.",
    color: "bg-yellow-500",
    stats: "ISO 9001"
  },
  {
    icon: Timer,
    title: "Entregas confiables",
    description: "Cumplimos plazos y acuerdos para que tus tiempos de obra nunca se detengan.",
    color: "bg-green-500",
    stats: "48hs"
  },
  {
    icon: Users,
    title: "500+ profesionales",
    description: "Confían en nuestros productos para sus proyectos más importantes.",
    color: "bg-mascolor-primary",
    stats: "500+"
  },
  {
    icon: Shield,
    title: "Garantía extendida",
    description: "Respaldamos la calidad de nuestros productos con garantías extendidas.",
    color: "bg-purple-500",
    stats: "5 años"
  },
  {
    icon: Truck,
    title: "Envío a todo el país",
    description: "Llegamos a cualquier punto del país con envíos rápidos y seguros.",
    color: "bg-orange-500",
    stats: "Nacional"
  }
];

export function BenefitsBento() {
  const { isMobile, isTablet } = useDeviceDetection();

  // Solo mostrar en móvil y tablet
  if (!isMobile && !isTablet) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-mascolor-pink-50 to-white lg:hidden">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-mazzard font-bold text-mascolor-dark mb-3">
            ¿Por qué elegir{" "}
            <span className="text-mascolor-primary">+COLOR</span>?
          </h2>
          <p className="text-mascolor-gray-600 max-w-lg mx-auto text-sm">
            Descubre las ventajas que nos convierten en la mejor opción para tus proyectos
          </p>
        </motion.div>

        {/* BentoGrid de beneficios */}
        <BentoGrid className="grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            
            return (
              <BentoItem
                key={benefit.title}
                className={`group hover:shadow-xl transition-all duration-300 hover:border-mascolor-primary/30 bg-white/90 backdrop-blur-sm ${
                  index === 0 || index === 3 ? 'sm:col-span-2' : ''
                }`}
                animationDelay={index * 0.1}
                motionProps={{
                  whileHover: { y: -5, scale: 1.02 },
                  transition: { duration: 0.3 }
                }}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header con icono y estadística */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    
                    {/* Estadística destacada */}
                    <div className="text-right">
                      <div className="text-2xl font-mazzard font-bold text-mascolor-primary">
                        {benefit.stats}
                      </div>
                      {benefit.title === "500+ profesionales" && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-mazzard font-bold text-mascolor-dark mb-2 group-hover:text-mascolor-primary transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-mascolor-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Indicador visual */}
                  <div className="mt-4 pt-4 border-t border-mascolor-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-mascolor-primary rounded-full animate-pulse"></div>
                        <span className="text-xs text-mascolor-gray-500 font-medium">
                          Beneficio activo
                        </span>
                      </div>
                      
                      {/* Progreso visual */}
                      <div className="w-16 h-1 bg-mascolor-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-mascolor-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </BentoItem>
            );
          })}
        </BentoGrid>

        {/* Call to action */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-mascolor-primary rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-mazzard font-bold text-mascolor-dark">
                  ¿Necesitas asesoramiento?
                </h3>
                <p className="text-sm text-mascolor-gray-600">
                  Nuestros expertos están listos para ayudarte
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <motion.a
                href="tel:0800-555-0189"
                className="bg-mascolor-primary hover:bg-mascolor-primary/90 text-white px-6 py-3 rounded-full text-sm font-mazzard font-bold shadow-lg transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-4 h-4" />
                <span>0800-555-0189</span>
              </motion.a>
              
              <motion.a
                href="https://wa.me/5493547639917"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm font-mazzard font-bold shadow-lg transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
