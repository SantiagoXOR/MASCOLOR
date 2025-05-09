/**
 * Script para gestionar versiones del proyecto +COLOR
 * 
 * Este script permite:
 * 1. Incrementar la versión del proyecto (major, minor, patch)
 * 2. Actualizar el CHANGELOG.md automáticamente
 * 3. Crear un commit con los cambios de versión
 * 4. Crear un tag de Git para la nueva versión
 * 
 * Uso:
 * node scripts/version-manager.js [patch|minor|major] [mensaje]
 * 
 * Ejemplo:
 * node scripts/version-manager.js patch "Corrección de errores en el componente Hero"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuración
const PACKAGE_JSON_PATH = path.join(__dirname, '../package.json');
const CHANGELOG_PATH = path.join(__dirname, '../CHANGELOG.md');

// Función para leer el package.json
function readPackageJson() {
  return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
}

// Función para escribir el package.json
function writePackageJson(packageJson) {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
}

// Función para incrementar la versión
function incrementVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

// Función para actualizar el CHANGELOG
function updateChangelog(version, message) {
  const date = new Date().toISOString().split('T')[0];
  const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  
  // Buscar la sección [Unreleased]
  const unreleasedRegex = /## \[Unreleased\]\n\n(.*?)(?=\n## \[|$)/s;
  const unreleasedMatch = changelogContent.match(unreleasedRegex);
  
  if (!unreleasedMatch) {
    console.error('No se pudo encontrar la sección [Unreleased] en el CHANGELOG');
    process.exit(1);
  }
  
  // Contenido de la sección Unreleased
  const unreleasedContent = unreleasedMatch[1];
  
  // Crear la nueva sección de versión
  const newVersionSection = `## [${version}] - ${date}\n\n${unreleasedContent}`;
  
  // Crear una nueva sección Unreleased vacía
  const newUnreleasedSection = `## [Unreleased]\n\n### Añadido\n- \n\n### Cambiado\n- \n\n### Corregido\n- \n\n`;
  
  // Reemplazar la sección Unreleased actual con la nueva y añadir la sección de versión
  const updatedChangelog = changelogContent.replace(
    /## \[Unreleased\]\n\n(.*?)(?=\n## \[|$)/s,
    `${newUnreleasedSection}${newVersionSection}`
  );
  
  // Actualizar los enlaces al final del archivo
  const updatedChangelogWithLinks = updatedChangelog.replace(
    /\[Unreleased\]: (.*?)\/compare\/v(.*?)\.\.\.HEAD/,
    `[Unreleased]: $1/compare/v${version}...HEAD\n[${version}]: $1/compare/v$2...v${version}`
  );
  
  fs.writeFileSync(CHANGELOG_PATH, updatedChangelogWithLinks, 'utf8');
}

// Función principal
async function main() {
  try {
    // Obtener argumentos
    const versionType = process.argv[2] || 'patch';
    const commitMessage = process.argv[3] || '';
    
    if (!['major', 'minor', 'patch'].includes(versionType)) {
      console.error('Tipo de versión inválido. Use: major, minor o patch');
      process.exit(1);
    }
    
    // Leer package.json
    const packageJson = readPackageJson();
    const currentVersion = packageJson.version;
    
    // Calcular nueva versión
    const newVersion = incrementVersion(currentVersion, versionType);
    console.log(`Incrementando versión: ${currentVersion} -> ${newVersion}`);
    
    // Actualizar package.json
    packageJson.version = newVersion;
    writePackageJson(packageJson);
    console.log('package.json actualizado');
    
    // Actualizar CHANGELOG.md
    updateChangelog(newVersion, commitMessage);
    console.log('CHANGELOG.md actualizado');
    
    // Crear commit y tag
    execSync('git add package.json CHANGELOG.md');
    execSync(`git commit -m "chore: bump version to ${newVersion}"`);
    execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
    
    console.log(`\nVersión ${newVersion} creada exitosamente!`);
    console.log('\nPara publicar los cambios, ejecute:');
    console.log('  git push origin main --tags');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
