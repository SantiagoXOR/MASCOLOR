// Deshabilitar depuración en producción
window.__DEBUG_ENABLED = false;
window.__DEBUG_LEVEL = 'none';
console.debug = () => {};