import { Button } from "@/components/ui/button";
import { getHeroContent } from "@/lib/api/hero";
import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp";
import { PhoneIcon, PlusCircle } from "lucide-react";

/**
 * Componente HeroBento para la versión mobile-first (Server Component)
 */
export async function HeroBento() {
  // Usar try/catch para manejar errores al obtener datos
  let heroData;
  try {
    heroData = await getHeroContent();
    // console.log("✅ Datos del Hero obtenidos correctamente");
  } catch (error) {
    console.error("❌ Error al obtener datos del Hero:", error);
    // Si hay un error, usamos valores predeterminados (los que devuelve getHeroContent en caso de error)
    heroData = await getHeroContent();
  }

  const {
    headline,
    subheadline,
    productTitle,
    backgroundImageUrl,
    productImageUrl,
    logoUrl,
    productBrandLogoUrl,
    phone,
    advisor,
    benefitItems,
  } = heroData;

  return (
    <section className="hero-bento-section md:hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradiente overlay para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/90 z-10" />
      </div>

      {/* Header + Teléfono */}
      <div className="relative pt-4 px-4 z-20 flex justify-between items-center">
        <Image src={logoUrl} alt="Logo +Color" width={120} height={30} />
        <a
          href={`tel:${phone}`}
          className="bg-mascolor-primary text-white font-bold px-4 py-1 rounded-full flex items-center gap-2 text-sm shadow-md"
        >
          <PhoneIcon size={16} /> {phone}
        </a>
      </div>

      {/* Título principal */}
      <div className="relative z-20 mt-16 px-6">
        <h1 className="text-3xl font-extrabold leading-tight max-w-[20ch] text-[#870064] drop-shadow-sm text-center">
          {headline}
        </h1>
        <p className="mt-2 text-base text-mascolor-gray-600 text-center">
          {subheadline}
        </p>
      </div>

      {/* Imagen de producto */}
      <div className="relative z-20 mt-6 px-6">
        <div className="hero-bento-product">
          <Image
            src={productImageUrl}
            alt={productTitle}
            width={300}
            height={300}
            className="mx-auto drop-shadow-xl relative z-10"
          />
        </div>
      </div>

      {/* Marca del producto */}
      <div className="relative z-20 mt-2 text-center">
        <Image
          src={productBrandLogoUrl}
          alt="Marca del producto"
          width={180}
          height={40}
          className="mx-auto"
        />
      </div>

      {/* Asesor y botón de contacto */}
      <div className="relative z-20 mt-6 px-6 flex items-center justify-between">
        <div className="hero-bento-advisor">
          <Image
            src={advisor.iconUrl}
            alt={advisor.name}
            width={40}
            height={40}
            className="hero-bento-advisor-image"
          />
          <div className="text-sm">
            <strong className="block text-[#870064]">{advisor.name}</strong>
            <span className="text-mascolor-gray-600 text-xs">
              {advisor.role}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <WhatsAppButton size="sm" />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/90 shadow-sm"
          >
            <PlusCircle className="w-5 h-5 text-mascolor-primary" />
          </Button>
        </div>
      </div>

      {/* Beneficios */}
      <div className="relative z-20 mt-6 px-6 grid grid-cols-3 gap-3 mb-8">
        {benefitItems.map((item) => (
          <div key={item.title} className="hero-bento-benefit">
            <Image
              src={item.icon}
              alt=""
              width={32}
              height={32}
              className="hero-bento-benefit-icon"
            />
            <p className="hero-bento-benefit-title">{item.title}</p>
            <p className="hero-bento-benefit-subtitle">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
