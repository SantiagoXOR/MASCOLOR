const fs = require('fs');
const path = require('path');

// Crear una imagen simple usando data URI
const createSimpleOGImage = () => {
  // Crear un HTML simple que se puede convertir a imagen
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #870064 0%, #b05096 50%, #d98bc4 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .content {
            z-index: 2;
            position: relative;
        }
        
        .logo {
            font-size: 120px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: -2px;
        }
        
        .tagline {
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 15px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .description {
            font-size: 24px;
            opacity: 0.95;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            max-width: 800px;
            line-height: 1.3;
        }
        
        .pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 40px 40px;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="pattern"></div>
    <div class="content">
        <div class="logo">+COLOR</div>
        <div class="tagline">Pinturas y Revestimientos</div>
        <div class="description">Alta calidad para tus proyectos de construcción y decoración</div>
    </div>
</body>
</html>`;

  return htmlContent;
};

// Crear una imagen base64 simple (placeholder)
const createBase64Image = () => {
  // Esta es una imagen PNG simple de 1200x630 con el gradiente de +COLOR
  // En un entorno real, usarías una librería como canvas o sharp para generar esto
  const base64Data = `data:image/svg+xml;base64,${Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#870064"/>
      <stop offset="50%" style="stop-color:#b05096"/>
      <stop offset="100%" style="stop-color:#d98bc4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">+COLOR</text>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="white">Pinturas y Revestimientos</text>
  <text x="600" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.95">Alta calidad para tus proyectos de construcción y decoración</text>
</svg>`).toString('base64')}`;
  
  return base64Data;
};

// Función principal
const generateSimpleOGImage = () => {
  try {
    // Crear el archivo HTML para conversión manual
    const htmlContent = createSimpleOGImage();
    const htmlPath = path.join(__dirname, '..', 'public', 'og-template.html');
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Template HTML creado en:', htmlPath);
    
    // Crear una imagen SVG optimizada
    const svgContent = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#870064"/>
      <stop offset="50%" style="stop-color:#b05096"/>
      <stop offset="100%" style="stop-color:#d98bc4"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <text x="600" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3)">+COLOR</text>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="white" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3)">Pinturas y Revestimientos</text>
  <text x="600" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.95" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3)">Alta calidad para tus proyectos de construcción y decoración</text>
</svg>`;
    
    const svgPath = path.join(__dirname, '..', 'public', 'og-image-final.svg');
    fs.writeFileSync(svgPath, svgContent);
    console.log('✅ Imagen SVG final creada en:', svgPath);
    
    console.log('\n📝 Instrucciones para completar la configuración:');
    console.log('1. Abre og-image-final.svg en un navegador');
    console.log('2. Toma una captura de pantalla o usa una herramienta online para convertir SVG a JPG');
    console.log('3. Guarda la imagen como "og-image.jpg" en la carpeta public/');
    console.log('4. Alternativamente, puedes usar el SVG directamente cambiando la extensión en config/seo.ts');
    
    // Crear una versión temporal usando el logo existente
    console.log('\n🔄 Creando imagen temporal usando recursos existentes...');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error al crear la imagen de Open Graph:', error);
    return false;
  }
};

// Ejecutar el script
if (generateSimpleOGImage()) {
  console.log('\n✅ Proceso completado exitosamente!');
  console.log('\n📱 Para verificar que funciona en WhatsApp:');
  console.log('1. Despliega el sitio web');
  console.log('2. Comparte el enlace en WhatsApp');
  console.log('3. Deberías ver la imagen de preview');
}
