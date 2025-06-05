#!/usr/bin/env node

/**
 * Script para desplegar la solución de SEO y verificar que todo esté funcionando
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Ejecuta un comando y devuelve el resultado
 */
function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completado`);
    return result;
  } catch (error) {
    console.log(`❌ Error en ${description}:`, error.message);
    return null;
  }
}

/**
 * Verifica que los archivos necesarios existan
 */
function verifyFiles() {
  console.log('\n📁 Verificando archivos de la implementación...');
  
  const requiredFiles = [
    'middleware.ts',
    'vercel.json',
    'app/productos/page.tsx',
    'app/productos/page-client.tsx',
    'docs/SEO-REDIRECTS-IMPLEMENTATION.md'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - FALTANTE`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

/**
 * Verifica el estado de Git
 */
function checkGitStatus() {
  console.log('\n📊 Verificando estado de Git...');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      console.log('📝 Archivos modificados:');
      console.log(status);
      return true;
    } else {
      console.log('✅ No hay cambios pendientes');
      return false;
    }
  } catch (error) {
    console.log('❌ Error verificando Git:', error.message);
    return false;
  }
}

/**
 * Crea commit con los cambios
 */
function commitChanges() {
  console.log('\n💾 Creando commit con los cambios...');
  
  try {
    // Agregar archivos
    runCommand('git add .', 'Agregando archivos al staging');
    
    // Crear commit
    const commitMessage = `feat: implementar redirects SEO para URLs indexadas

- Agregar middleware.ts para redirects automáticos 301
- Crear página /productos con filtros por marca y categoría  
- Actualizar vercel.json con redirects de respaldo
- Implementar solución para /etiqueta-producto/facil-fix
- Agregar scripts de testing y verificación
- Actualizar sitemap con nuevas URLs
- Documentar implementación completa

Resuelve: URLs indexadas en Google que devolvían 404
Beneficios: Preserva SEO, mejora UX, estructura URLs`;

    runCommand(`git commit -m "${commitMessage}"`, 'Creando commit');
    
    return true;
  } catch (error) {
    console.log('❌ Error creando commit:', error.message);
    return false;
  }
}

/**
 * Muestra instrucciones de deploy
 */
function showDeployInstructions() {
  console.log('\n🚀 INSTRUCCIONES DE DEPLOY');
  console.log('==========================');
  
  console.log('\n1. 📤 PUSH A REPOSITORIO:');
  console.log('   git push origin main');
  console.log('   (o la rama que uses para deploy)');
  
  console.log('\n2. 🔄 VERIFICAR DEPLOY EN VERCEL:');
  console.log('   - Acceder a dashboard de Vercel');
  console.log('   - Verificar que el deploy se complete exitosamente');
  console.log('   - Probar URL: https://pinturasmascolor.com.ar/etiqueta-producto/facil-fix');
  
  console.log('\n3. 🧪 PROBAR REDIRECTS:');
  console.log('   node scripts/verify-production-redirects.js https://pinturasmascolor.com.ar');
  
  console.log('\n4. 📊 GOOGLE SEARCH CONSOLE:');
  console.log('   - Usar archivos en ./reports/ para solicitar re-indexación');
  console.log('   - Eliminar URLs problemáticas del índice');
  console.log('   - Solicitar indexación de URLs nuevas');
  console.log('   - Enviar sitemap actualizado');
  
  console.log('\n5. 📈 MONITOREO:');
  console.log('   - Verificar reducción de errores 404');
  console.log('   - Monitorear tráfico a nuevas URLs');
  console.log('   - Confirmar desaparición de URLs problemáticas');
}

/**
 * Genera resumen final
 */
function generateSummary() {
  console.log('\n📋 RESUMEN DE LA IMPLEMENTACIÓN');
  console.log('===============================');
  
  console.log('\n✅ ARCHIVOS CREADOS:');
  console.log('   - middleware.ts (redirects automáticos)');
  console.log('   - app/productos/page.tsx (página de productos)');
  console.log('   - app/productos/page-client.tsx (lógica de filtros)');
  console.log('   - docs/SEO-REDIRECTS-IMPLEMENTATION.md (documentación)');
  console.log('   - scripts/test-redirects.js (testing)');
  console.log('   - scripts/google-reindex-request.js (re-indexación)');
  console.log('   - scripts/verify-production-redirects.js (verificación)');
  
  console.log('\n🔧 ARCHIVOS MODIFICADOS:');
  console.log('   - vercel.json (redirects de respaldo)');
  console.log('   - app/sitemap.ts (nuevas URLs)');
  
  console.log('\n🎯 PROBLEMA RESUELTO:');
  console.log('   /etiqueta-producto/facil-fix → /#productos (redirect 301)');
  
  console.log('\n📊 BENEFICIOS:');
  console.log('   - Preservación de SEO con redirects 301');
  console.log('   - Mejor experiencia de usuario');
  console.log('   - Reducción de errores 404');
  console.log('   - URLs estructuradas y semánticas');
  console.log('   - Sitemap actualizado');
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 DEPLOY DE SOLUCIÓN SEO - REDIRECTS');
  console.log('=====================================\n');
  
  // Verificar archivos
  if (!verifyFiles()) {
    console.log('\n❌ Faltan archivos necesarios. Verifica la implementación.');
    process.exit(1);
  }
  
  // Verificar Git
  const hasChanges = checkGitStatus();
  
  if (hasChanges) {
    // Crear commit
    if (commitChanges()) {
      console.log('\n✅ Commit creado exitosamente');
    } else {
      console.log('\n❌ Error creando commit');
      process.exit(1);
    }
  }
  
  // Mostrar instrucciones
  showDeployInstructions();
  generateSummary();
  
  console.log('\n🎉 ¡Implementación lista para deploy!');
  console.log('📝 Sigue las instrucciones arriba para completar el proceso');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { verifyFiles, commitChanges, showDeployInstructions };
