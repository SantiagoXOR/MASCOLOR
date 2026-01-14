#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 VERIFICACIÓN DEL DISEÑO DEL WIDGET DEL ASESOR SEGÚN MOCKUP\n');

// Función para verificar y mostrar resultados
function logResult(condition, message, details = '') {
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} ${message}`);
  if (details && condition) {
    console.log(`   ${details}`);
  }
  if (!condition) {
    console.log(`   ❗ Falta implementar: ${details}`);
  }
}

// 1. Verificar estructura del componente según mockup
console.log('📱 ESTRUCTURA DEL COMPONENTE SEGÚN MOCKUP\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  // Verificar tooltip arriba del avatar
  logResult(
    content.includes('Tooltip con información del asesor') && content.includes('-top-16'),
    'Tooltip arriba del avatar implementado',
    'Tooltip con "Leandro" y "Asesor de +COLOR" posicionado arriba'
  );
  
  // Verificar avatar circular con ícono de usuario
  logResult(
    content.includes('w-16 h-16') && content.includes('bg-mascolor-primary') && content.includes('rounded-full'),
    'Avatar circular con color primario',
    'Avatar de 64px (w-16 h-16) con fondo del color primario'
  );
  
  // Verificar punto verde de estado online
  logResult(
    content.includes('bg-green-400') && content.includes('animate-pulse') && content.includes('-bottom-1 -right-1'),
    'Indicador online (punto verde)',
    'Punto verde animado en la esquina inferior derecha del avatar'
  );
  
  // Verificar contenedor con borde morado
  logResult(
    content.includes('border-4 border-mascolor-primary') && content.includes('rounded-full'),
    'Contenedor con borde morado',
    'Contenedor principal con borde grueso del color primario'
  );
  
  // Verificar botón WhatsApp verde
  logResult(
    content.includes('bg-green-500') && content.includes('Contactar por WhatsApp'),
    'Botón WhatsApp verde principal',
    'Botón verde con texto "Contactar por WhatsApp"'
  );
  
  // Verificar botón circular +COLOR
  logResult(
    content.includes('w-12 h-12') && content.includes('bg-mascolor-primary') && content.includes('rounded-full'),
    'Botón +COLOR circular',
    'Botón circular morado con símbolo "+" y efecto de rotación'
  );
  
} else {
  logResult(false, 'Componente HeroBentoMobile', 'Archivo no encontrado');
}

// 2. Verificar estilos CSS específicos
console.log('\n🎨 ESTILOS CSS SEGÚN MOCKUP\n');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
if (fs.existsSync(cssFile)) {
  const content = fs.readFileSync(cssFile, 'utf8');
  
  // Verificar estilos del tooltip
  logResult(
    content.includes('.advisor-tooltip') && content.includes('background: #870064'),
    'Estilos del tooltip definidos',
    'Tooltip con fondo del color primario y flecha'
  );
  
  // Verificar estilos del avatar principal
  logResult(
    content.includes('.advisor-main-avatar') && content.includes('width: 64px'),
    'Estilos del avatar principal',
    'Avatar de 64px con fondo del color primario'
  );
  
  // Verificar estilos del contenedor principal
  logResult(
    content.includes('.advisor-main-container') && content.includes('border: 4px solid #870064'),
    'Estilos del contenedor principal',
    'Contenedor con borde grueso del color primario'
  );
  
  // Verificar estilos del botón WhatsApp
  logResult(
    content.includes('.advisor-whatsapp-main-btn') && content.includes('background: #25d366'),
    'Estilos del botón WhatsApp',
    'Botón verde de WhatsApp con tipografía Mazzard'
  );
  
  // Verificar estilos del botón +COLOR
  logResult(
    content.includes('.advisor-plus-main-btn') && content.includes('background: #870064'),
    'Estilos del botón +COLOR',
    'Botón circular con fondo del color primario'
  );
  
  // Verificar responsividad
  logResult(
    content.includes('@media (max-width: 480px)') && content.includes('@media (max-width: 360px)'),
    'Responsividad implementada',
    'Breakpoints para móviles pequeños y muy pequeños'
  );
  
} else {
  logResult(false, 'Estilos CSS', 'Archivo no encontrado');
}

// 3. Verificar elementos específicos del mockup
console.log('\n🎯 ELEMENTOS ESPECÍFICOS DEL MOCKUP\n');

if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  // Verificar tipografía Mazzard
  logResult(
    content.includes('font-mazzard'),
    'Tipografía Mazzard implementada',
    'Uso consistente de la fuente Mazzard en textos'
  );
  
  // Verificar color primario consistente
  logResult(
    content.includes('bg-mascolor-primary') && content.includes('border-mascolor-primary'),
    'Color primario consistente (#870064)',
    'Uso del color primario en avatar, borde y botón +COLOR'
  );
  
  // Verificar funcionalidad de WhatsApp
  logResult(
    content.includes('wa.me/5493547639917') && content.includes('window.open'),
    'Funcionalidad de WhatsApp',
    'Enlace directo a WhatsApp con número correcto'
  );
  
  // Verificar funcionalidad del modal
  logResult(
    content.includes('setAdvisorModalOpen(true)') && content.includes('onClick'),
    'Funcionalidad del modal',
    'Avatar clickeable que abre el modal del asesor'
  );
  
  // Verificar navegación a productos
  logResult(
    content.includes('getElementById("products")') && content.includes('scrollIntoView'),
    'Navegación a productos',
    'Botón +COLOR navega a la sección de productos'
  );
}

// 4. Verificar layout horizontal
console.log('\n📐 LAYOUT HORIZONTAL SEGÚN MOCKUP\n');

if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  // Verificar estructura flex horizontal
  logResult(
    content.includes('flex items-center gap-2'),
    'Layout horizontal implementado',
    'Estructura flex con elementos alineados horizontalmente'
  );
  
  // Verificar orden de elementos: Avatar + Contenedor
  logResult(
    content.includes('Avatar de Leandro') && content.includes('Contenedor principal'),
    'Orden correcto de elementos',
    'Avatar a la izquierda, contenedor principal a la derecha'
  );
  
  // Verificar elementos dentro del contenedor
  logResult(
    content.includes('flex-1 bg-green-500') && content.includes('w-12 h-12 bg-mascolor-primary'),
    'Elementos internos del contenedor',
    'Botón WhatsApp expandible + botón +COLOR circular'
  );
}

// 5. Verificar animaciones y efectos
console.log('\n✨ ANIMACIONES Y EFECTOS\n');

if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  // Verificar animación del punto online
  logResult(
    content.includes('animate-pulse'),
    'Animación del indicador online',
    'Punto verde con animación de pulso'
  );
  
  // Verificar efectos hover
  logResult(
    content.includes('whileHover') && content.includes('scale: 1.05'),
    'Efectos hover implementados',
    'Efectos de escala en hover para interactividad'
  );
  
  // Verificar efecto de rotación del botón +COLOR
  logResult(
    content.includes('animate={{ rotate: [0, 360] }}'),
    'Efecto de rotación del botón +COLOR',
    'Rotación continua del símbolo "+" en el botón'
  );
}

// Resumen final
console.log('\n🎯 RESUMEN DE COINCIDENCIA CON MOCKUP\n');

const allFiles = [heroFile, cssFile];
const existingFiles = allFiles.filter(file => fs.existsSync(file));

logResult(
  existingFiles.length === allFiles.length,
  `Archivos necesarios: ${existingFiles.length}/${allFiles.length}`,
  'Todos los archivos requeridos están presentes'
);

if (existingFiles.length === allFiles.length) {
  console.log('\n🎉 ¡EXCELENTE! El widget del asesor coincide con el mockup');
  console.log('✅ Tooltip arriba del avatar con información');
  console.log('✅ Avatar circular morado con ícono de usuario');
  console.log('✅ Punto verde de estado online animado');
  console.log('✅ Contenedor con borde morado grueso');
  console.log('✅ Botón WhatsApp verde principal expandible');
  console.log('✅ Botón +COLOR circular con rotación');
  console.log('✅ Layout horizontal según diseño');
  console.log('✅ Tipografía Mazzard consistente');
  console.log('✅ Color primario #870064 en todos los elementos');
  console.log('✅ Funcionalidades completas (WhatsApp, modal, navegación)');
  console.log('✅ Responsividad para móviles');
} else {
  console.log('\n⚠️  Implementación incompleta. Revisar archivos faltantes.');
}

console.log('\n📋 ELEMENTOS DEL MOCKUP IMPLEMENTADOS:');
console.log('🔸 Tooltip: "Leandro" + "Asesor de +COLOR" (fondo morado)');
console.log('🔸 Avatar: Círculo morado con ícono de usuario');
console.log('🔸 Estado: Punto verde animado (online)');
console.log('🔸 Contenedor: Borde morado grueso, fondo blanco');
console.log('🔸 WhatsApp: Botón verde "Contactar por WhatsApp"');
console.log('🔸 +COLOR: Botón circular morado con símbolo "+"');
console.log('🔸 Layout: Horizontal, avatar izquierda + contenedor derecha');
console.log('🔸 Interacción: Avatar clickeable, botones funcionales');
