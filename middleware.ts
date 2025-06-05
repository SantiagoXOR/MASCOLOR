import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware para manejar redirects de URLs antiguas y SEO
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Manejar redirects de URLs antiguas de etiquetas de productos
  if (pathname.startsWith("/etiqueta-producto/")) {
    const slug = pathname.replace("/etiqueta-producto/", "");

    // Mapeo de slugs antiguos a nuevas rutas
    const redirectMap: Record<string, { path: string; query: string }> = {
      "facil-fix": { path: "/productos", query: "marca=facilfix" },
      facilfix: { path: "/productos", query: "marca=facilfix" },
      premium: { path: "/productos", query: "marca=premium" },
      expression: { path: "/productos", query: "marca=expression" },
      ecopainting: { path: "/productos", query: "marca=ecopainting" },
      newhouse: { path: "/productos", query: "marca=newhouse" },
    };

    // Si existe un mapeo específico, redirigir
    if (redirectMap[slug]) {
      const url = request.nextUrl.clone();
      url.pathname = redirectMap[slug].path;
      url.search = redirectMap[slug].query;
      return NextResponse.redirect(url, 301); // Redirect permanente para SEO
    }

    // Si no existe mapeo específico, redirigir a productos generales
    const url = request.nextUrl.clone();
    url.pathname = "/productos";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // Manejar otras URLs antiguas comunes
  const legacyRedirects: Record<string, { path: string; query: string }> = {
    "/productos-facilfix": { path: "/productos", query: "marca=facilfix" },
    "/facilfix": { path: "/productos", query: "marca=facilfix" },
    "/premium": { path: "/productos", query: "marca=premium" },
    "/expression": { path: "/productos", query: "marca=expression" },
    "/ecopainting": { path: "/productos", query: "marca=ecopainting" },
    "/newhouse": { path: "/productos", query: "marca=newhouse" },
    "/catalogo": { path: "/productos", query: "" },
    "/productos-catalogo": { path: "/productos", query: "" },
  };

  if (legacyRedirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirects[pathname].path;
    url.search = legacyRedirects[pathname].query;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

/**
 * Configuración del middleware
 * Define en qué rutas se ejecuta el middleware
 */
export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto:
    // - API routes
    // - _next/static (archivos estáticos)
    // - _next/image (optimización de imágenes)
    // - favicon.ico
    // - archivos públicos con extensión
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
