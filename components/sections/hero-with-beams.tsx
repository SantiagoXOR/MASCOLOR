"use client";

import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { BeamsBackground } from "@/components/ui/beams-background";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

export function HeroWithBeams() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeBrand, setActiveBrand] = useState<string>("premium");
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Animación del parallax para la imagen de fondo
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Animación para intensificar el degradado al hacer scroll
  const [beamIntensity, setBeamIntensity] = useState<
    "subtle" | "medium" | "strong"
  >("subtle");

  // Efecto para cambiar la intensidad basada en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollY > viewportHeight * 0.1) {
        setBeamIntensity("medium");
      } else {
        setBeamIntensity("subtle");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mapeo de marcas a imágenes de productos y fondos
  const brandAssets = {
    facilfix: {
      bucket: "/images/products/FACIL FIX EXTERIOR BLANCO.png",
      background: "/images/buckets/FACILFIX.jpg",
      title: "Reparación y construcción con",
    },
    ecopainting: {
      bucket: "/images/products/ECOPAINTINGMEMBRANA.png",
      background: "/images/buckets/ECOPAINTING.jpg",
      title: "Pinturas ecológicas con",
    },
    newhouse: {
      bucket: "/images/products/NEW-HOUSE-BARNIZ-MARINO.png",
      background: "/images/buckets/NEWHOUSE.jpg",
      title: "Protección para maderas con",
    },
    premium: {
      bucket: "/images/products/PREMIUM-SUPERLAVABLE.png",
      background: "/images/buckets/PREMIUM.jpg",
      title: "Acabados de alta calidad con",
    },
    expression: {
      bucket: "/images/products/EXPRESSION-LATEX-ACRILICO-INTERIOR-1.png",
      background: "/images/buckets/EXPRESSION.jpg",
      title: "Expresá tu estilo con",
    },
  };

  // Función para manejar el cambio de marca
  const handleBrandChange = async (brand: string) => {
    if (brand === activeBrand || isChanging) return;

    // Pausar el autoplay cuando el usuario interactúa
    setAutoplayEnabled(false);
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    setIsChanging(true);

    // Cambiar la marca activa sin animar la salida del producto actual
    setActiveBrand(brand);

    // Animar la entrada del nuevo producto sin esperar
    controls
      .start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, type: "spring" },
      })
      .then(() => {
        setIsChanging(false);
      });

    // Reanudar el autoplay después de 10 segundos de inactividad
    autoplayTimerRef.current = setTimeout(() => {
      setAutoplayEnabled(true);
    }, 10000);
  };

  // Efecto para el autoplay
  useEffect(() => {
    if (!autoplayEnabled || isChanging) return;

    const brands = Object.keys(brandAssets);
    const currentIndex = brands.indexOf(activeBrand);
    const nextIndex = (currentIndex + 1) % brands.length;

    const timer = setTimeout(() => {
      handleBrandChange(brands[nextIndex]);
    }, 7000);

    return () => clearTimeout(timer);
  }, [activeBrand, autoplayEnabled, isChanging]);

  // Efecto para precargar las imágenes
  useEffect(() => {
    // Precargar todas las imágenes de productos
    const preloadImages = async () => {
      const preloadPromises = Object.keys(brandAssets).map((brand) => {
        return new Promise<void>((resolve) => {
          // Usar el constructor global de Image del navegador, no el componente de Next.js
          const img = document.createElement("img");
          const src = brandAssets[brand as keyof typeof brandAssets].bucket;

          img.onload = () => {
            console.log(`Imagen precargada con éxito: ${brand}`);
            resolve();
          };

          img.onerror = () => {
            console.error(`Error al precargar imagen: ${brand}`);
            // Resolvemos en lugar de rechazar para no bloquear otras cargas
            resolve();
          };

          // Asignar src después de configurar los handlers
          img.src = src;
          console.log(`Precargando imagen: ${brand} - ${src}`);
        });
      });

      // Esperar a que todas las imágenes se precarguen
      await Promise.all(preloadPromises);
      console.log("Todas las imágenes han sido precargadas");
    };

    preloadImages();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-24 md:py-28"
    >
      {/* Imagen de fondo con efecto parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${
                brandAssets[activeBrand as keyof typeof brandAssets].background
              }')`,
              transition: "background-image 0.5s ease-in-out",
              opacity: 0.7, // Ajustada para mejor balance con beams
              backgroundPosition: "center",
              backgroundSize: "cover",
              filter: "brightness(0.85) contrast(1.1)", // Ajustado para mejor visibilidad
              mixBlendMode: "normal",
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[url('/images/paint-texture.jpg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      </motion.div>

      {/* Fondo de Beams con intensidad basada en scroll */}
      <BeamsBackground
        intensity={beamIntensity}
        className="absolute inset-0 z-1 mix-blend-screen opacity-70"
      />

      <div className="container mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Contenido principal - 3 columnas en desktop */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 text-center lg:text-left text-white space-y-6 md:space-y-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-2"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeBrand}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {brandAssets[activeBrand as keyof typeof brandAssets].title}
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start mb-6 w-full relative z-20"
            >
              {/* Carrusel de marcas con desplazamiento infinito */}
              <div className="logos-slider relative">
                {/* Indicador de marca activa */}
                <div className="absolute -bottom-6 left-0 w-full flex justify-center">
                  <div className="flex gap-3 items-center">
                    {Object.keys(brandAssets).map((brand) => (
                      <button
                        key={brand}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeBrand === brand
                            ? "bg-white scale-150"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        onClick={() => handleBrandChange(brand)}
                        aria-label={`Seleccionar marca ${brand}`}
                      />
                    ))}
                  </div>
                </div>

                <InfiniteMarquee
                  speed={3}
                  pauseOnHover={true}
                  className="h-24 w-full py-2"
                  childrenClassName="mx-4"
                  onItemHover={handleBrandChange}
                  onItemClick={handleBrandChange}
                >
                  {/* Contenedor único para los logos */}
                  <div className="logos-slide flex items-center gap-16">
                    {/* Logos de marcas */}
                    {Object.keys(brandAssets).map((brand) => (
                      <div
                        key={brand}
                        className={`logo-item ${
                          brand === "facilfix" || brand === "premium"
                            ? "logo-item-large"
                            : ""
                        }`}
                        data-brand={brand}
                      >
                        <div
                          className={`relative ${
                            brand === "facilfix" || brand === "premium"
                              ? "h-16 w-[140px]"
                              : "h-12 w-[100px]"
                          }`}
                        >
                          <Image
                            src={`/images/logos/${brand}.svg`}
                            alt={`Logo ${brand}`}
                            width={
                              brand === "facilfix" || brand === "premium"
                                ? 140
                                : 100
                            }
                            height={
                              brand === "facilfix" || brand === "premium"
                                ? 56
                                : 40
                            }
                            className="object-contain w-full h-full cursor-pointer transition-all duration-300"
                            style={{
                              filter: "brightness(0) invert(1)",
                              opacity: activeBrand === brand ? 1 : 0.6,
                              transform:
                                activeBrand === brand
                                  ? "scale(1.15)"
                                  : "scale(1)",
                              transition: "all 0.3s ease-in-out",
                            }}
                            priority
                            onMouseEnter={() => handleBrandChange(brand)}
                            onClick={() => handleBrandChange(brand)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteMarquee>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-2 text-gray-100 font-normal mt-8"
            >
              Pinturas y revestimientos de alto rendimiento
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg mb-8 text-gray-200 max-w-xl mx-auto lg:mx-0 font-bold"
            >
              para{" "}
              <span className="font-extrabold">hogares, obras y proyectos</span>{" "}
              que inspiran.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4"
            >
              {/* Botón de WhatsApp primero */}
              <motion.div
                className="inline-block"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Link
                  href="https://wa.me/5493547639917?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20productos%20de%20%2BCOLOR."
                  className="animated-button relative flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all px-8 py-4 text-lg group"
                  style={{
                    backgroundColor: "#870064", // Color principal de la marca
                    color: "white",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "#870064",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#25D366";
                    e.currentTarget.style.borderColor = "#25D366";
                    e.currentTarget.style.borderRadius = "12px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#870064";
                    e.currentTarget.style.borderColor = "#870064";
                    e.currentTarget.style.borderRadius = "9999px";
                  }}
                >
                  <span className="flex items-center gap-2 relative z-10">
                    Contactar por WhatsApp
                    <MessageCircle className="w-5 h-5" />
                  </span>
                </Link>
              </motion.div>

              {/* Botón Ver productos como inline */}
              <Link
                href="/#productos"
                className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-white bg-[#870064] hover:bg-[#870064]/90 px-6 py-3 rounded-full transition-all duration-300 border-2 border-[#870064]"
              >
                Ver productos
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Imagen lateral - visible en todas las pantallas */}
          <motion.div
            className="flex lg:col-span-2 justify-center items-center mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative w-full h-[400px] lg:h-[500px] flex justify-center items-center">
              {/* Círculo de fondo */}
              <div
                className="absolute w-[280px] h-[280px] lg:w-[380px] lg:h-[380px] rounded-full shadow-xl"
                style={{
                  zIndex: 10,
                  background:
                    "linear-gradient(135deg, rgba(135,0,100,0.15) 0%, rgba(135,0,100,0.2) 100%)",
                  backdropFilter: "blur(5px)",
                }}
              />

              {/* Contenedor de la imagen del producto */}
              <motion.div
                key={activeBrand}
                initial={{ opacity: 1, scale: 1 }}
                animate={controls}
                className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]"
                style={{ zIndex: 20 }}
              >
                <Image
                  src={
                    brandAssets[activeBrand as keyof typeof brandAssets].bucket
                  }
                  alt={`Producto ${activeBrand}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain z-30"
                  style={{
                    filter: "drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.2))",
                    opacity: 1,
                    mixBlendMode: "normal",
                  }}
                  priority
                  unoptimized={true}
                  onLoad={() => {
                    console.log(`Imagen cargada: ${activeBrand}`);
                  }}
                  onError={() => {
                    console.error(`Error al cargar la imagen: ${activeBrand}`);
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
