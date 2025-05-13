"use client";

// Este componente no renderiza nada
// Se usa para reemplazar componentes de debug sin romper las referencias
export function NoopComponent() {
  return null;
}

// Exportamos una versión que acepta cualquier prop
export function NoopComponentWithProps(props: any) {
  return null;
}
