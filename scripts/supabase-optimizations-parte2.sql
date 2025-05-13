-- Optimizaciones para la base de datos de +COLOR (Parte 2)
-- IMPORTANTE: Ejecutar cada instrucción VACUUM por separado
-- Las instrucciones VACUUM no pueden ejecutarse dentro de una transacción

-- Optimizar la tabla products
VACUUM ANALYZE products;

-- Optimizar la tabla categories
VACUUM ANALYZE categories;

-- Optimizar la tabla brands
VACUUM ANALYZE brands;

-- Optimizar la tabla assets
VACUUM ANALYZE assets;

-- Optimizar la vista materializada
VACUUM ANALYZE mv_products_with_relations;
