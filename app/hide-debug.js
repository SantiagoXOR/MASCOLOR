// Deshabilitar depuración en producción
if (typeof window !== "undefined") {
  window.__DEBUG_ENABLED = false;
  window.__DEBUG_LEVEL = "none";
}
console.debug = () => {};
