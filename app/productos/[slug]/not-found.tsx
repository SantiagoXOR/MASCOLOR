import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-mascolor-primary/10 rounded-full flex items-center justify-center">
            <Search size={48} className="text-mascolor-primary" />
          </div>
          <h1 className="text-4xl font-bold text-mascolor-dark mb-4">
            Producto no encontrado
          </h1>
          <p className="text-lg text-mascolor-gray-600 mb-8 max-w-md mx-auto">
            El producto que buscas no está disponible o ha sido movido. 
            Te invitamos a explorar nuestro catálogo completo.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/#productos">
            <Button className="bg-mascolor-primary hover:bg-mascolor-primary/90 text-white px-8 py-3">
              <ArrowLeft size={20} className="mr-2" />
              Ver catálogo completo
            </Button>
          </Link>
          
          <div className="text-sm text-mascolor-gray-500">
            <p>¿Necesitas ayuda? Contáctanos por WhatsApp</p>
            <a
              href="https://wa.me/5493547639917?text=Hola! No pude encontrar un producto en el catálogo. ¿Podrían ayudarme?"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mascolor-primary hover:underline"
            >
              +54 9 3547 63-9917
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
