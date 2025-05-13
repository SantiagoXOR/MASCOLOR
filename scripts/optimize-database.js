/**
 * Script para optimizar el rendimiento de la base de datos Supabase
 * 
 * Este script realiza las siguientes acciones:
 * 1. Verifica la estructura actual de la base de datos
 * 2. Crea índices para mejorar el rendimiento de las consultas
 * 3. Implementa políticas RLS para seguridad
 * 4. Optimiza las tablas existentes
 * 5. Genera un informe de rendimiento
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar variables de entorno
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en .env.local');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para mostrar información de depuración
function logDebug(message, data = {}) {
  console.log(`🔍 ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Función para mostrar error
function logError(message, error) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
}

// Función para mostrar éxito
function logSuccess(message, data = {}) {
  console.log(`✅ ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Función para ejecutar consultas SQL
async function executeSQL(query, params = {}) {
  try {
    // Usar la función rpc para ejecutar SQL personalizado
    const { data, error } = await supabase.rpc('execute_sql', {
      query_text: query,
      query_params: params
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    // Intentar con método alternativo si rpc no está disponible
    try {
      const { data, error: restError } = await supabase
        .from('_sql')
        .select('*')
        .eq('query', query);

      if (restError) {
        throw restError;
      }

      return data;
    } catch (fallbackError) {
      logError(`Error al ejecutar SQL: ${query}`, fallbackError);
      throw fallbackError;
    }
  }
}

// Función para verificar índices existentes
async function checkExistingIndexes() {
  logDebug('Verificando índices existentes...');
  
  try {
    const query = `
      SELECT
        t.relname AS table_name,
        i.relname AS index_name,
        a.attname AS column_name
      FROM
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a
      WHERE
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relkind = 'r'
        AND t.relname IN ('products', 'categories', 'brands', 'assets')
      ORDER BY
        t.relname,
        i.relname;
    `;
    
    const { data, error } = await supabase.rpc('query', { query_text: query });
    
    if (error) {
      throw error;
    }
    
    logSuccess('Índices existentes:', data);
    return data;
  } catch (error) {
    logError('Error al verificar índices existentes', error);
    return [];
  }
}

// Función para crear índices optimizados
async function createOptimizedIndexes() {
  logDebug('Creando índices optimizados...');
  
  // Lista de índices a crear
  const indexes = [
    // Índices para la tabla products
    {
      table: 'products',
      column: 'name',
      type: 'btree',
      description: 'Mejora búsquedas por nombre de producto'
    },
    {
      table: 'products',
      column: 'slug',
      type: 'btree',
      description: 'Mejora búsquedas por slug de producto'
    },
    {
      table: 'products',
      column: 'category_id',
      type: 'btree',
      description: 'Mejora filtrado por categoría'
    },
    {
      table: 'products',
      column: 'brand_id',
      type: 'btree',
      description: 'Mejora filtrado por marca'
    },
    // Índice para búsqueda de texto
    {
      table: 'products',
      column: 'name',
      type: 'gin',
      using: 'gin(to_tsvector(\'spanish\', name))',
      description: 'Mejora búsqueda de texto en nombres de productos'
    },
    // Índices para la tabla categories
    {
      table: 'categories',
      column: 'slug',
      type: 'btree',
      description: 'Mejora búsquedas por slug de categoría'
    },
    // Índices para la tabla brands
    {
      table: 'brands',
      column: 'slug',
      type: 'btree',
      description: 'Mejora búsquedas por slug de marca'
    },
    // Índices para la tabla assets
    {
      table: 'assets',
      column: 'id',
      type: 'btree',
      description: 'Mejora búsquedas por ID de asset'
    }
  ];
  
  // Crear cada índice
  for (const index of indexes) {
    try {
      const indexName = `idx_${index.table}_${index.column}_${index.type}`;
      
      // Verificar si el índice ya existe
      const { data: existingIndexes } = await supabase
        .from('pg_indexes')
        .select('indexname')
        .eq('tablename', index.table)
        .eq('indexname', indexName);
      
      if (existingIndexes && existingIndexes.length > 0) {
        logDebug(`Índice ${indexName} ya existe, omitiendo...`);
        continue;
      }
      
      // Crear el índice
      let query;
      if (index.using) {
        query = `CREATE INDEX IF NOT EXISTS ${indexName} ON ${index.table} USING ${index.using};`;
      } else {
        query = `CREATE INDEX IF NOT EXISTS ${indexName} ON ${index.table} USING ${index.type} (${index.column});`;
      }
      
      await executeSQL(query);
      logSuccess(`Índice creado: ${indexName}`, { description: index.description });
    } catch (error) {
      logError(`Error al crear índice para ${index.table}.${index.column}`, error);
    }
  }
}

// Función para optimizar la tabla de productos
async function optimizeProductsTable() {
  logDebug('Optimizando tabla de productos...');
  
  try {
    // 1. Añadir columna para búsqueda de texto
    const addSearchVectorQuery = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS search_vector tsvector 
      GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED;
    `;
    
    await executeSQL(addSearchVectorQuery);
    logSuccess('Columna search_vector añadida a la tabla products');
    
    // 2. Crear índice GIN para la columna search_vector
    const createSearchIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN (search_vector);
    `;
    
    await executeSQL(createSearchIndexQuery);
    logSuccess('Índice GIN creado para search_vector');
    
    // 3. Optimizar la tabla
    const vacuumQuery = `VACUUM ANALYZE products;`;
    await executeSQL(vacuumQuery);
    logSuccess('Tabla products optimizada con VACUUM ANALYZE');
    
  } catch (error) {
    logError('Error al optimizar la tabla de productos', error);
  }
}

// Función para implementar políticas RLS
async function implementRLSPolicies() {
  logDebug('Implementando políticas RLS...');
  
  try {
    // 1. Habilitar RLS en las tablas
    const tables = ['products', 'categories', 'brands', 'assets'];
    
    for (const table of tables) {
      const enableRLSQuery = `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`;
      await executeSQL(enableRLSQuery);
      logSuccess(`RLS habilitado en tabla ${table}`);
      
      // 2. Crear política para permitir lectura a todos
      const createPolicyQuery = `
        CREATE POLICY IF NOT EXISTS "Allow public read access" 
        ON ${table} FOR SELECT 
        USING (true);
      `;
      
      await executeSQL(createPolicyQuery);
      logSuccess(`Política de lectura pública creada para ${table}`);
      
      // 3. Crear política para permitir escritura solo a usuarios autenticados con rol específico
      // Nota: Esto es un ejemplo, ajusta según tus necesidades de seguridad
      const createWritePolicyQuery = `
        CREATE POLICY IF NOT EXISTS "Allow authenticated write access" 
        ON ${table} FOR ALL 
        USING (auth.role() = 'authenticated' AND auth.uid() IN (
          SELECT user_id FROM admin_users
        ));
      `;
      
      await executeSQL(createWritePolicyQuery);
      logSuccess(`Política de escritura para autenticados creada para ${table}`);
    }
  } catch (error) {
    logError('Error al implementar políticas RLS', error);
  }
}

// Función para generar informe de rendimiento
async function generatePerformanceReport() {
  logDebug('Generando informe de rendimiento...');
  
  try {
    // 1. Obtener estadísticas de tablas
    const tableStatsQuery = `
      SELECT
        relname as table_name,
        n_live_tup as row_count,
        pg_size_pretty(pg_total_relation_size(relid)) as total_size,
        pg_size_pretty(pg_relation_size(relid)) as table_size,
        pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
      FROM
        pg_stat_user_tables
      WHERE
        relname IN ('products', 'categories', 'brands', 'assets')
      ORDER BY
        n_live_tup DESC;
    `;
    
    const { data: tableStats } = await supabase.rpc('query', { query_text: tableStatsQuery });
    
    // 2. Obtener estadísticas de índices
    const indexStatsQuery = `
      SELECT
        indexrelname as index_name,
        relname as table_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size
      FROM
        pg_stat_user_indexes
      WHERE
        relname IN ('products', 'categories', 'brands', 'assets')
      ORDER BY
        idx_scan DESC;
    `;
    
    const { data: indexStats } = await supabase.rpc('query', { query_text: indexStatsQuery });
    
    // 3. Generar informe
    const report = {
      timestamp: new Date().toISOString(),
      tableStatistics: tableStats || [],
      indexStatistics: indexStats || [],
      recommendations: []
    };
    
    // 4. Añadir recomendaciones basadas en estadísticas
    if (tableStats) {
      for (const table of tableStats) {
        if (parseInt(table.row_count) > 1000) {
          report.recommendations.push({
            table: table.table_name,
            recommendation: 'Considerar paginación para consultas grandes',
            details: `La tabla tiene ${table.row_count} filas, implementa paginación con LIMIT y OFFSET`
          });
        }
      }
    }
    
    if (indexStats) {
      for (const index of indexStats) {
        if (parseInt(index.index_scans) === 0) {
          report.recommendations.push({
            index: index.index_name,
            table: index.table_name,
            recommendation: 'Considerar eliminar índice no utilizado',
            details: `El índice ${index.index_name} no ha sido utilizado en consultas`
          });
        }
      }
    }
    
    // 5. Guardar informe en archivo
    const reportPath = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const reportFile = path.join(reportPath, `db-performance-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    logSuccess(`Informe de rendimiento generado: ${reportFile}`);
    return report;
  } catch (error) {
    logError('Error al generar informe de rendimiento', error);
    return null;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando optimización de la base de datos...');
  
  try {
    // 1. Verificar índices existentes
    await checkExistingIndexes();
    
    // 2. Crear índices optimizados
    await createOptimizedIndexes();
    
    // 3. Optimizar tabla de productos
    await optimizeProductsTable();
    
    // 4. Implementar políticas RLS
    await implementRLSPolicies();
    
    // 5. Generar informe de rendimiento
    const report = await generatePerformanceReport();
    
    console.log('\n✨ Optimización de base de datos completada con éxito!');
    
    if (report && report.recommendations.length > 0) {
      console.log('\n📋 Recomendaciones adicionales:');
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.recommendation} - ${rec.details}`);
      });
    }
  } catch (error) {
    console.error('\n❌ Error durante la optimización de la base de datos:', error);
  }
}

// Ejecutar función principal
main();
