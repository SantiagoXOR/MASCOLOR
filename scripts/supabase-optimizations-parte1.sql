-- Optimizaciones para la base de datos de +COLOR (Parte 1)
-- Ejecutar este script desde la interfaz SQL de Supabase

-- 1. Crear índices para mejorar el rendimiento de las consultas

-- Índices para la tabla products
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING btree (name);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products USING btree (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products USING btree (brand_id);

-- Índice para búsqueda de texto en productos
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('spanish', name));

-- Índices para la tabla categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories USING btree (slug);

-- Índices para la tabla brands
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands USING btree (slug);

-- Índices para la tabla assets
CREATE INDEX IF NOT EXISTS idx_assets_id ON assets USING btree (id);

-- 2. Añadir columna para búsqueda de texto en productos
ALTER TABLE products
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED;

-- Crear índice GIN para la columna search_vector
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN (search_vector);

-- 3. Optimizar la estructura de la tabla products

-- Añadir restricciones para mejorar la integridad de los datos
ALTER TABLE products
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN slug SET NOT NULL;

-- Añadir restricción única si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_product_slug'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT unique_product_slug UNIQUE (slug);
  END IF;
END $$;

-- 4. Optimizar la tabla categories

-- Añadir restricciones para mejorar la integridad de los datos
ALTER TABLE categories
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN slug SET NOT NULL;

-- Añadir restricción única si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_category_slug'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT unique_category_slug UNIQUE (slug);
  END IF;
END $$;

-- 5. Optimizar la tabla brands

-- Añadir restricciones para mejorar la integridad de los datos
ALTER TABLE brands
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN slug SET NOT NULL;

-- Añadir restricción única si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_brand_slug'
  ) THEN
    ALTER TABLE brands ADD CONSTRAINT unique_brand_slug UNIQUE (slug);
  END IF;
END $$;

-- 6. Implementar políticas RLS (Row Level Security)

-- Habilitar RLS en las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura a todos
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products"
ON products FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
CREATE POLICY "Allow public read access on categories"
ON categories FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow public read access on brands" ON brands;
CREATE POLICY "Allow public read access on brands"
ON brands FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow public read access on assets" ON assets;
CREATE POLICY "Allow public read access on assets"
ON assets FOR SELECT
USING (true);

-- 7. Crear vistas materializadas para consultas frecuentes

-- Vista materializada para productos con sus categorías y marcas
DROP MATERIALIZED VIEW IF EXISTS mv_products_with_relations;
CREATE MATERIALIZED VIEW mv_products_with_relations AS
SELECT
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  b.name AS brand_name,
  b.slug AS brand_slug,
  b.logo_url AS brand_logo_url
FROM
  products p
LEFT JOIN
  categories c ON p.category_id = c.id
LEFT JOIN
  brands b ON p.brand_id = b.id;

-- Crear índices en la vista materializada
CREATE INDEX IF NOT EXISTS idx_mv_products_category_slug ON mv_products_with_relations (category_slug);
CREATE INDEX IF NOT EXISTS idx_mv_products_brand_slug ON mv_products_with_relations (brand_slug);
CREATE INDEX IF NOT EXISTS idx_mv_products_name ON mv_products_with_relations (name);

-- 8. Crear función para actualizar la vista materializada
CREATE OR REPLACE FUNCTION refresh_mv_products_with_relations()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_products_with_relations;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear triggers para actualizar la vista materializada cuando cambian los datos
DROP TRIGGER IF EXISTS refresh_mv_products_with_relations_trigger ON products;
CREATE TRIGGER refresh_mv_products_with_relations_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_mv_products_with_relations();

DROP TRIGGER IF EXISTS refresh_mv_products_with_relations_categories_trigger ON categories;
CREATE TRIGGER refresh_mv_products_with_relations_categories_trigger
AFTER INSERT OR UPDATE OR DELETE ON categories
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_mv_products_with_relations();

DROP TRIGGER IF EXISTS refresh_mv_products_with_relations_brands_trigger ON brands;
CREATE TRIGGER refresh_mv_products_with_relations_brands_trigger
AFTER INSERT OR UPDATE OR DELETE ON brands
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_mv_products_with_relations();

-- 11. Crear función para búsqueda de productos optimizada
CREATE OR REPLACE FUNCTION search_products(
  search_term TEXT,
  category_slug_param TEXT DEFAULT NULL,
  brand_slug_param TEXT DEFAULT NULL,
  limit_val INTEGER DEFAULT 100,
  offset_val INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  description TEXT,
  image_url TEXT,
  category_id UUID,
  brand_id UUID,
  category_name TEXT,
  category_slug TEXT,
  brand_name TEXT,
  brand_slug TEXT,
  brand_logo_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.slug, p.name, p.description, p.image_url,
    p.category_id, p.brand_id,
    c.name AS category_name, c.slug AS category_slug,
    b.name AS brand_name, b.slug AS brand_slug, b.logo_url AS brand_logo_url
  FROM
    products p
  LEFT JOIN
    categories c ON p.category_id = c.id
  LEFT JOIN
    brands b ON p.brand_id = b.id
  WHERE
    (search_term IS NULL OR p.search_vector @@ to_tsquery('spanish', search_term))
    AND (category_slug_param IS NULL OR c.slug = category_slug_param)
    AND (brand_slug_param IS NULL OR b.slug = brand_slug_param)
  ORDER BY
    p.name
  LIMIT limit_val
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;
