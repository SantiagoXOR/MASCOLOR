"use client";

import { ImageDebug } from "./ImageDebug";
import { ProductImageDebug } from "./ProductImageDebug";
import { ProductImageDebugger } from "./ProductImageDebugger";
import { DebugControls } from "./DebugControls";

/**
 * Componente que agrupa todas las herramientas de depuración
 */
export function DebugTools() {
  // No renderizar en producción
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <>
      <DebugControls />
      <ImageDebug />
      <ProductImageDebug />
      <ProductImageDebugger />
    </>
  );
}
