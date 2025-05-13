/**
 * Script para depurar el componente ProductCard
 *
 * Este script agrega código de depuración al componente ProductCard para
 * registrar información detallada sobre la carga de productos en la consola del navegador.
 */

const fs = require("fs");
const path = require("path");

// Rutas de archivos
const PRODUCT_CARD_PATH = path.join(
  __dirname,
  "../components/ui/product-card.tsx"
);

// Función para agregar código de depuración
function addDebugCode() {
  try {
    console.log(
      "🔍 Agregando código de depuración al componente ProductCard..."
    );

    // Leer el archivo
    const content = fs.readFileSync(PRODUCT_CARD_PATH, "utf8");

    // Agregar código de depuración
    const debuggedContent = content
      .replace(
        "export function ProductCard({ product, onClick }: ProductCardProps) {",
        `// Función para registrar información de depuración
const logProductDebug = (message, data = {}) => {
  console.log(
    '%c[ProductCard Debug]%c ' + message,
    'background: #870064; color: white; padding: 2px 4px; border-radius: 2px;',
    'color: #870064; font-weight: bold;',
    data
  );
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  // Registrar información del producto
  logProductDebug('Renderizando ProductCard', {
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    asset_id: product.asset_id
  });`
      )
      .replace(
        "<OptimizedImage",
        `{/* Debug */}
            {logProductDebug('Renderizando imagen', {
              image_url: product.image_url,
              fallbackSrc: "/images/products/placeholder.jpg"
            })}
            <OptimizedImage`
      );

    // Guardar el archivo modificado
    fs.writeFileSync(PRODUCT_CARD_PATH, debuggedContent);

    console.log("✅ Código de depuración agregado correctamente");
    console.log(
      "ℹ️ Reinicia el servidor de desarrollo para aplicar los cambios"
    );
    console.log(
      "ℹ️ Abre la consola del navegador para ver la información de depuración"
    );
  } catch (error) {
    console.error("❌ Error al agregar código de depuración:", error);
  }
}

// Función para eliminar código de depuración
function removeDebugCode() {
  try {
    console.log(
      "🔍 Eliminando código de depuración del componente ProductCard..."
    );

    // Leer el archivo
    const content = fs.readFileSync(PRODUCT_CARD_PATH, "utf8");

    // Eliminar código de depuración
    const cleanedContent = content
      .replace(
        /\/\/ Función para registrar información de depuración[\s\S]*?};/m,
        ""
      )
      .replace(/\/\/ Registrar información del producto[\s\S]*?}\);/m, "")
      .replace(/{\/* Debug \*\/}[\s\S]*?}}\n            /m, "");

    // Guardar el archivo modificado
    fs.writeFileSync(PRODUCT_CARD_PATH, cleanedContent);

    console.log("✅ Código de depuración eliminado correctamente");
    console.log(
      "ℹ️ Reinicia el servidor de desarrollo para aplicar los cambios"
    );
  } catch (error) {
    console.error("❌ Error al eliminar código de depuración:", error);
  }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (command === "add") {
  addDebugCode();
} else if (command === "remove") {
  removeDebugCode();
} else {
  console.log("Uso: node debug-product-card.js [add|remove]");
  console.log("  add    - Agregar código de depuración");
  console.log("  remove - Eliminar código de depuración");
}
