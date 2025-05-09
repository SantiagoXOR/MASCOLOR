import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mascolor-pink-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="relative h-12 w-48 mb-4">
              <Image
                src="/images/logos/+color.svg"
                alt="Logo +COLOR"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-gray-300 mb-6">
              Pinturas y revestimientos de alta calidad para tus proyectos de
              construcción y decoración.
            </p>
            <div className="flex space-x-6">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="https://www.facebook.com/Mas-Color-101711804951834"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <div className="bg-white/10 hover:bg-[#1877F2] p-3 rounded-full transition-all duration-300 group">
                    <Facebook
                      size={22}
                      className="text-white group-hover:text-white transition-colors"
                    />
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="https://www.instagram.com/pinturas.mascolor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <div className="bg-white/10 hover:bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-3 rounded-full transition-all duration-300 group">
                    <Instagram
                      size={22}
                      className="text-white group-hover:text-white transition-colors"
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Inicio
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#productos"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Productos
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link
                  href="/donde-comprar"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    ¿Dónde comprar?
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Contacto
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-mascolor-pink-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-2">
            &copy; {currentYear}
            <span className="relative inline-block h-5 w-20">
              <Image
                src="/images/logos/+colorsolo.svg"
                alt="Logo +COLOR"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(0.7)" }}
              />
            </span>
            Diseño{" "}
            <span className="relative inline-block h-6 w-16 align-middle ml-1">
              <Image
                src="/images/logos/xor.svg"
                alt="Logo XOR"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(0.7)" }}
              />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
