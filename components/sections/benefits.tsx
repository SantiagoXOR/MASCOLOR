"use client";

import { motion } from "framer-motion";
import {
  Paintbrush,
  Shield,
  Clock,
  HeartHandshake,
  Award,
  Timer,
} from "lucide-react";

const benefits = [
  {
    icon: <HeartHandshake size={32} strokeWidth={1.5} />,
    title: "Asesoramiento experto",
    description:
      "Te acompañamos en cada paso, con soluciones para profesionales, obras o proyectos del hogar.",
  },
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    title: "Calidad garantizada",
    description:
      "Usamos materias primas de primera línea y procesos que aseguran acabados duraderos y perfectos.",
  },
  {
    icon: <Timer size={32} strokeWidth={1.5} />,
    title: "Entregas confiables",
    description:
      "Cumplimos plazos y acuerdos para que tus tiempos de obra nunca se detengan.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

export function BenefitsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-mascolor-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-mascolor-dark mb-4">
            Lo que nos <span className="text-mascolor-primary">diferencia</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calidad, confianza y cumplimiento para que cada obra sea un éxito.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-mascolor-pink-100 hover:border-mascolor-primary/30 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-mascolor-primary bg-mascolor-pink-50 rounded-full group-hover:bg-mascolor-pink-100 transition-colors duration-300 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-mascolor-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
