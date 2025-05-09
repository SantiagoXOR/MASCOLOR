"use client";

import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function ContactPageClient() {
  return (
    <>
      <main>
        <div className="py-12 bg-mascolor-primary/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-mascolor-dark text-center">
              Contacto
            </h1>
            <p className="text-lg text-center mt-4 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta.
            </p>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
