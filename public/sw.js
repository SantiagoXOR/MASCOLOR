/**
 * Service Worker stub (completamente deshabilitado)
 * 
 * Este archivo existe solo para evitar errores 404 cuando algo
 * intenta cargar /sw.js automáticamente.
 * 
 * NO implementa ninguna funcionalidad de service worker real.
 * Las funcionalidades PWA están completamente deshabilitadas.
 */

// Registrar un service worker vacío que no hace nada
self.addEventListener('install', function(event) {
  // No hacer nada en la instalación
  console.log('[SW] Service Worker stub installed - no functionality');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // No hacer nada en la activación
  console.log('[SW] Service Worker stub activated - no functionality');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // No interceptar ninguna petición - dejar que el navegador maneje todo
  // Esto asegura que el service worker no interfiera con el funcionamiento normal
  return;
});

// No implementar ninguna funcionalidad de caché, push notifications, etc.
// Este es un service worker completamente pasivo
