-- Crear tabla de activos para el sistema de gestión de activos
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  originalFormat TEXT,
  originalWidth INTEGER,
  originalHeight INTEGER,
  originalSize INTEGER,
  dateAdded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  versions JSONB,
  metadata JSONB
);

-- Añadir comentarios a la tabla y columnas
COMMENT ON TABLE public.assets IS 'Tabla para almacenar información sobre activos (imágenes, videos, etc.)';
COMMENT ON COLUMN public.assets.id IS 'ID único del activo (hash MD5)';
COMMENT ON COLUMN public.assets.name IS 'Nombre descriptivo del activo';
COMMENT ON COLUMN public.assets.category IS 'Categoría del activo (products, backgrounds, logos, etc.)';
COMMENT ON COLUMN public.assets.originalFormat IS 'Formato original del activo (png, jpg, etc.)';
COMMENT ON COLUMN public.assets.originalWidth IS 'Ancho original del activo en píxeles';
COMMENT ON COLUMN public.assets.originalHeight IS 'Alto original del activo en píxeles';
COMMENT ON COLUMN public.assets.originalSize IS 'Tamaño original del activo en bytes';
COMMENT ON COLUMN public.assets.dateAdded IS 'Fecha y hora en que se añadió el activo';
COMMENT ON COLUMN public.assets.versions IS 'Versiones del activo en diferentes formatos y tamaños';
COMMENT ON COLUMN public.assets.metadata IS 'Metadatos adicionales del activo';

-- Añadir columna asset_id a la tabla products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS asset_id TEXT,
ADD CONSTRAINT fk_asset
   FOREIGN KEY (asset_id)
   REFERENCES public.assets (id)
   ON DELETE SET NULL;

-- Añadir índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets (category);
CREATE INDEX IF NOT EXISTS idx_assets_name ON public.assets (name);
CREATE INDEX IF NOT EXISTS idx_products_asset_id ON public.products (asset_id);

-- Configurar políticas de seguridad (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY "Allow read access for all users" ON public.assets
    FOR SELECT
    USING (true);

-- Política para permitir inserción y actualización solo a usuarios autenticados
CREATE POLICY "Allow insert for authenticated users only" ON public.assets
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users only" ON public.assets
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir eliminación solo a usuarios autenticados
CREATE POLICY "Allow delete for authenticated users only" ON public.assets
    FOR DELETE
    USING (auth.role() = 'authenticated');
