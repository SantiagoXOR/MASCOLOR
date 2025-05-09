"use client";

import { motion } from "framer-motion";
import { Users, Star, Truck } from "lucide-react";

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

// Datos de los bloques de confianza
const trustBlocks = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "500+ profesionales",
    subtitle: "confían en nuestros productos",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "4.9/5 calificación",
    subtitle: "+300 opiniones verificadas",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Envíos a todo el país",
    subtitle: "rápidos y seguros",
  },
];

export function TrustBlocks() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {trustBlocks.map((block, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-[#870064] bg-[#f9f0f6] rounded-full">
                {block.icon}
              </div>
              <h3 className="text-xl font-bold mb-1 text-gray-900">{block.title}</h3>
              <p className="text-gray-600">{block.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
