import type { Viewport } from "next";
import { siteConfig } from "../config/seo";

/**
 * Configuración de viewport para Next.js 15
 * Incluye themeColor que se movió desde metadata
 */
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
