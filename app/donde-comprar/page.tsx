import LayoutWithComponents from "../layout-with-components";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "¿Dónde comprar? | +COLOR",
  description:
    "Encuentra los puntos de venta de +COLOR más cercanos a tu ubicación.",
};

const locations = [
  {
    id: 1,
    name: "Casa Central +COLOR",
    address: "Av. Siempreviva 742, Buenos Aires",
    phone: "011 4567-8901",
    hours: "Lunes a Viernes: 8:00 - 16:00",
    mapUrl: "https://maps.google.com",
  },
  {
    id: 2,
    name: "Distribuidor Oficial Norte",
    address: "Av. Libertador 5678, San Isidro",
    phone: "011 4765-4321",
    hours: "Lunes a Viernes: 8:00 - 16:00",
    mapUrl: "https://maps.google.com",
  },
  {
    id: 3,
    name: "Distribuidor Oficial Sur",
    address: "Av. Hipólito Yrigoyen 1234, Quilmes",
    phone: "011 4250-9876",
    hours: "Lunes a Viernes: 8:00 - 16:00",
    mapUrl: "https://maps.google.com",
  },
  {
    id: 4,
    name: "Distribuidor Oficial Oeste",
    address: "Av. Rivadavia 12345, Morón",
    phone: "011 4627-5432",
    hours: "Lunes a Viernes: 8:00 - 16:00",
    mapUrl: "https://maps.google.com",
  },
];

export default function DondeComprarPage() {
  return (
    <LayoutWithComponents>
      <div className="py-24 bg-mascolor-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-mascolor-dark text-center">
            ¿Dónde comprar?
          </h1>
          <p className="text-lg text-center mt-4 max-w-2xl mx-auto">
            Encuentra los puntos de venta de +COLOR más cercanos a tu ubicación.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((location) => (
              <Card
                key={location.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-mascolor-dark mb-4">
                    {location.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-mascolor-secondary mt-1 mr-3" />
                      <span>{location.address}</span>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-mascolor-secondary mt-1 mr-3" />
                      <span>{location.phone}</span>
                    </div>

                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-mascolor-secondary mt-1 mr-3" />
                      <span>{location.hours}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <span>Ver en mapa</span>
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-mascolor-dark mb-4">
              ¿No encuentras un punto de venta cercano?
            </h2>
            <p className="text-mascolor-gray-600 mb-6 max-w-2xl mx-auto">
              Contáctanos y te ayudaremos a encontrar el distribuidor más
              cercano a tu ubicación.
            </p>
            <Button
              variant="color"
              size="lg"
              className="bg-mascolor-primary hover:bg-mascolor-primary/90"
              asChild
            >
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </div>
      </section>
    </LayoutWithComponents>
  );
}
