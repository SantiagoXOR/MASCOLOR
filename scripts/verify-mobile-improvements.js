const fs = require("fs");
const path = require("path");

// Colores para la consola
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Verificaciones de PRIORIDAD ALTA
function verifyHighPriorityImprovements() {
  log("\n🔥 VERIFICANDO MEJORAS DE PRIORIDAD ALTA", colors.bold);

  let allPassed = true;

  // 1. Verificar imágenes móviles
  log("\n1. 📱 Verificando imágenes móviles optimizadas...", colors.blue);
  const mobileImages = [
    "FACILFIX-mobile.jpg",
    "ECOPAINTING-mobile.jpg",
    "NEWHOUSE-mobile.jpg",
    "PREMIUM-mobile.jpg",
    "EXPRESSION-mobile.jpg",
  ];

  const bucketsDir = path.join(__dirname, "..", "public", "images", "buckets");
  let mobileImagesFound = 0;

  mobileImages.forEach((imageName) => {
    const imagePath = path.join(bucketsDir, imageName);
    if (fs.existsSync(imagePath)) {
      log(`   ✅ ${imageName} encontrada`, colors.green);
      mobileImagesFound++;
    } else {
      log(`   ❌ ${imageName} NO encontrada`, colors.red);
      allPassed = false;
    }
  });

  log(
    `   📊 Total: ${mobileImagesFound}/${mobileImages.length} imágenes móviles`,
    mobileImagesFound === mobileImages.length ? colors.green : colors.yellow
  );

  // 2. Verificar eliminación de componentes debug
  log("\n2. 🧹 Verificando eliminación de componentes debug...", colors.blue);
  const heroBentoMobilePath = path.join(
    __dirname,
    "..",
    "components",
    "sections",
    "hero-bento-mobile.tsx"
  );

  if (fs.existsSync(heroBentoMobilePath)) {
    const content = fs.readFileSync(heroBentoMobilePath, "utf8");

    // Verificar que no hay indicador de errores hardcodeado
    if (content.includes("2 issues") || content.includes("bg-red-500")) {
      log("   ❌ Componente debug hardcodeado encontrado", colors.red);
      allPassed = false;
    } else {
      log(
        "   ✅ No se encontraron componentes debug hardcodeados",
        colors.green
      );
    }

    // Verificar que usa BentoItem
    if (content.includes("<BentoItem")) {
      log("   ✅ Usa componentes BentoItem correctamente", colors.green);
    } else {
      log("   ❌ No usa componentes BentoItem", colors.red);
      allPassed = false;
    }
  } else {
    log("   ❌ Archivo hero-bento-mobile.tsx no encontrado", colors.red);
    allPassed = false;
  }

  // 3. Verificar hook de detección de dispositivos
  log("\n3. 📱 Verificando hook de detección de dispositivos...", colors.blue);
  const deviceDetectionPath = path.join(
    __dirname,
    "..",
    "hooks",
    "useDeviceDetection.ts"
  );

  if (fs.existsSync(deviceDetectionPath)) {
    const content = fs.readFileSync(deviceDetectionPath, "utf8");

    if (
      content.includes('addEventListener("resize"') &&
      content.includes('addEventListener("orientationchange"')
    ) {
      log("   ✅ Hook con listeners de resize y orientación", colors.green);
    } else {
      log("   ❌ Hook sin listeners adecuados", colors.red);
      allPassed = false;
    }

    if (content.includes("debounce") || content.includes("setTimeout")) {
      log("   ✅ Implementa debounce para optimización", colors.green);
    } else {
      log("   ❌ No implementa debounce", colors.red);
      allPassed = false;
    }
  } else {
    log("   ❌ Hook useDeviceDetection no encontrado", colors.red);
    allPassed = false;
  }

  return allPassed;
}

// Verificaciones de PRIORIDAD MEDIA
function verifyMediumPriorityImprovements() {
  log("\n🔶 VERIFICANDO MEJORAS DE PRIORIDAD MEDIA", colors.bold);

  let allPassed = true;

  // 1. Verificar breakpoints para tablets
  log("\n1. 📱 Verificando breakpoints para tablets...", colors.blue);
  const bentoCSS = path.join(__dirname, "..", "styles", "bento.css");

  if (fs.existsSync(bentoCSS)) {
    const content = fs.readFileSync(bentoCSS, "utf8");

    if (content.includes("768px) and (max-width: 1023px)")) {
      log("   ✅ Breakpoint para tablets implementado", colors.green);
    } else {
      log("   ❌ Breakpoint para tablets no encontrado", colors.red);
      allPassed = false;
    }

    if (content.includes("min-width: 1024px")) {
      log("   ✅ Breakpoint para desktop actualizado", colors.green);
    } else {
      log("   ❌ Breakpoint para desktop no actualizado", colors.red);
      allPassed = false;
    }
  } else {
    log("   ❌ Archivo bento.css no encontrado", colors.red);
    allPassed = false;
  }

  // 2. Verificar transiciones suaves
  log("\n2. 🎭 Verificando transiciones suaves...", colors.blue);
  const pageFile = path.join(__dirname, "..", "app", "page.tsx");
  const homeContentFile = path.join(__dirname, "..", "app", "home-content.tsx");

  let transitionFound = false;

  // Verificar en page.tsx
  if (fs.existsSync(pageFile)) {
    const content = fs.readFileSync(pageFile, "utf8");
    if (content.includes("HomeContent")) {
      transitionFound = true;
    }
  }

  // Verificar en home-content.tsx
  if (fs.existsSync(homeContentFile)) {
    const content = fs.readFileSync(homeContentFile, "utf8");
    if (
      content.includes("useMobileHero") &&
      content.includes("showMobileHero")
    ) {
      transitionFound = true;
    }
  }

  if (transitionFound) {
    log("   ✅ Lógica de transición implementada", colors.green);
  } else {
    log("   ❌ Lógica de transición no encontrada", colors.red);
    allPassed = false;
  }

  return allPassed;
}

// Verificar logging limpio
function verifyCleanLogging() {
  log("\n🧹 VERIFICANDO LOGGING LIMPIO", colors.bold);

  let allPassed = true;

  const filesToCheck = [
    "components/ui/optimized-image.tsx",
    "components/ui/product-card.tsx",
  ];

  filesToCheck.forEach((relativePath) => {
    const filePath = path.join(__dirname, "..", relativePath);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");

      // Verificar que los console.log están condicionados
      const hasConditionalLogging =
        content.includes('process.env.NODE_ENV === "development"') &&
        (content.includes("DEBUG_IMAGES") ||
          content.includes("DEBUG_PRODUCTS"));

      if (hasConditionalLogging) {
        log(
          `   ✅ ${relativePath}: Logging condicionado correctamente`,
          colors.green
        );
      } else if (
        content.includes("console.log") ||
        content.includes("console.error")
      ) {
        log(
          `   ⚠️ ${relativePath}: Contiene logging no condicionado`,
          colors.yellow
        );
      } else {
        log(`   ✅ ${relativePath}: Sin logging innecesario`, colors.green);
      }
    } else {
      log(`   ❌ ${relativePath}: Archivo no encontrado`, colors.red);
      allPassed = false;
    }
  });

  return allPassed;
}

// Función principal
function main() {
  log("🚀 VERIFICACIÓN DE MEJORAS MOBILE-FIRST PARA +COLOR", colors.bold);
  log("=".repeat(60), colors.blue);

  const highPriorityPassed = verifyHighPriorityImprovements();
  const mediumPriorityPassed = verifyMediumPriorityImprovements();
  const cleanLoggingPassed = verifyCleanLogging();

  // Resumen final
  log("\n📊 RESUMEN FINAL", colors.bold);
  log("=".repeat(30), colors.blue);

  log(
    `Prioridad Alta: ${highPriorityPassed ? "✅ COMPLETADO" : "❌ PENDIENTE"}`,
    highPriorityPassed ? colors.green : colors.red
  );
  log(
    `Prioridad Media: ${
      mediumPriorityPassed ? "✅ COMPLETADO" : "❌ PENDIENTE"
    }`,
    mediumPriorityPassed ? colors.green : colors.red
  );
  log(
    `Logging Limpio: ${cleanLoggingPassed ? "✅ COMPLETADO" : "❌ PENDIENTE"}`,
    cleanLoggingPassed ? colors.green : colors.red
  );

  const allPassed =
    highPriorityPassed && mediumPriorityPassed && cleanLoggingPassed;

  if (allPassed) {
    log("\n🎉 ¡TODAS LAS MEJORAS IMPLEMENTADAS CORRECTAMENTE!", colors.green);
    log("✨ El sistema mobile-first está listo para producción", colors.green);
  } else {
    log("\n⚠️ Algunas mejoras necesitan atención", colors.yellow);
    log("🔧 Revisa los elementos marcados como pendientes", colors.yellow);
  }

  process.exit(allPassed ? 0 : 1);
}

// Ejecutar verificación
if (require.main === module) {
  main();
}

module.exports = {
  verifyHighPriorityImprovements,
  verifyMediumPriorityImprovements,
  verifyCleanLogging,
};
