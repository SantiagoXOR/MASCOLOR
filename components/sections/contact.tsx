"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  User,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493547639917";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20productos%20de%20%2BCOLOR.`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío de formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-mascolor-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-mascolor-primary mb-2">
            ¿Tenés dudas? Hablemos.
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl font-medium text-mascolor-dark">
            <Phone className="w-5 h-5 text-mascolor-primary" />
            <a href="tel:08005550189" className="hover:underline">
              0800-555-0189
            </a>
            <span className="text-mascolor-gray-400 text-sm">
              – Asesoramiento gratuito
            </span>
          </div>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-0">
            {/* Columna 1: Formulario */}
            <div className="md:col-span-2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-mascolor-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-mascolor-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-mascolor-dark">
                  Envíanos un mensaje
                </h3>
              </div>

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 text-green-700 rounded-md"
                >
                  ¡Gracias por tu mensaje! Te respondemos a la brevedad.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="¿Cómo te llamás?"
                    className="shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Para poder responderte"
                    className="shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Contanos qué producto necesitás o qué superficie vas a pintar..."
                    rows={4}
                    className="shadow-sm"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="color"
                    size="lg"
                    className="w-full sm:w-auto bg-mascolor-primary hover:bg-mascolor-primary/90 shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                  </Button>

                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chateá por WhatsApp
                  </Link>
                </div>
              </form>
            </div>

            {/* Columna 2: Información de contacto y horarios */}
            <div className="p-6 md:p-8 bg-mascolor-gray-50/50">
              <div className="space-y-6">
                {/* Teléfono */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mascolor-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-mascolor-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-mascolor-dark">
                      Teléfono
                    </h4>
                  </div>
                  <a
                    href="tel:08005550189"
                    className="text-mascolor-primary hover:underline flex items-center gap-2"
                  >
                    0800-555-0189
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mascolor-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-mascolor-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-mascolor-dark">
                      Email
                    </h4>
                  </div>
                  <a
                    href="mailto:info@pinturasmascolor.com.ar"
                    className="text-mascolor-primary hover:underline flex items-center gap-2 break-all"
                  >
                    info@pinturasmascolor.com.ar
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>

                {/* Dirección */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mascolor-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-mascolor-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-mascolor-dark">
                      Dirección
                    </h4>
                  </div>
                  <p className="text-mascolor-gray-600">
                    Alta Gracia
                    <br />
                    Córdoba, Argentina
                  </p>
                </div>

                {/* Horarios */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mascolor-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-mascolor-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-mascolor-dark">
                      Horarios
                    </h4>
                  </div>
                  <ul className="space-y-1 text-mascolor-gray-600">
                    <li className="flex justify-between">
                      <span>Lunes - Sábados:</span>
                      <span className="font-medium">8:00 - 21:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingos:</span>
                      <span>Cerrado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
