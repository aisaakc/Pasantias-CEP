-- Script para actualizar todos los roles con las clasificaciones faltantes
-- Este script agrega las clasificaciones pupitre y holamundo a todos los roles que tengan permisos

-- Primero, verificar qué roles tienen permisos de clasificaciones
SELECT 
    id_clasificacion,
    nombre,
    adicional
FROM clasificacion 
WHERE type_id = 3 
AND adicional IS NOT NULL 
AND adicional::text LIKE '%id_clasificacion%';

-- Actualizar el rol Super Administrador con todas las clasificaciones
UPDATE clasificacion
SET adicional = jsonb_build_object(
    'id_objeto', COALESCE(adicional->'id_objeto', jsonb_build_array()),
    'id_clasificacion', jsonb_build_array(
        1,      -- Géneros
        3,      -- Roles
        4,      -- Programas
        5,      -- Cursos
        8,      -- Preguntas
        27,     -- Iconos
        73,     -- Objetos
        96,     -- Roles Facilitadores
        110,    -- Carreras
        122,    -- Estados
        123,    -- Municipios
        124,    -- Parroquias
        100050, -- Modalidad
        100059, -- Status
        100094, -- Documentos
        100121, -- Tipos de Documento
        100172, -- pupitre
        100173  -- holamundo
    )
)
WHERE id_clasificacion = 15 
AND type_id = 3;

-- Actualizar el rol Administrador con las clasificaciones faltantes
UPDATE clasificacion
SET adicional = jsonb_build_object(
    'id_objeto', COALESCE(adicional->'id_objeto', jsonb_build_array()),
    'id_clasificacion', jsonb_build_array(
        1,      -- Géneros
        3,      -- Roles
        4,      -- Programas
        5,      -- Cursos
        8,      -- Preguntas
        27,     -- Iconos
        73,     -- Objetos
        96,     -- Roles Facilitadores
        110,    -- Carreras
        122,    -- Estados
        123,    -- Municipios
        124,    -- Parroquias
        100050, -- Modalidad
        100059, -- Status
        100094, -- Documentos
        100121, -- Tipos de Documento
        100172, -- pupitre
        100173  -- holamundo
    )
)
WHERE id_clasificacion = 98 
AND type_id = 3;

-- Verificar que se actualizaron correctamente
SELECT 
    id_clasificacion,
    nombre,
    adicional
FROM clasificacion 
WHERE type_id = 3 
AND adicional IS NOT NULL 
AND adicional::text LIKE '%id_clasificacion%'
ORDER BY id_clasificacion;

-- Script para agregar clasificaciones a roles que no las tienen
-- (Solo si el rol ya tiene id_objeto pero no id_clasificacion)
UPDATE clasificacion
SET adicional = jsonb_build_object(
    'id_objeto', COALESCE(adicional->'id_objeto', jsonb_build_array()),
    'id_clasificacion', jsonb_build_array(
        1,      -- Géneros
        3,      -- Roles
        4,      -- Programas
        5,      -- Cursos
        8,      -- Preguntas
        27,     -- Iconos
        73,     -- Objetos
        96,     -- Roles Facilitadores
        110,    -- Carreras
        122,    -- Estados
        123,    -- Municipios
        124,    -- Parroquias
        100050, -- Modalidad
        100059, -- Status
        100094, -- Documentos
        100121, -- Tipos de Documento
        100172, -- pupitre
        100173  -- holamundo
    )
)
WHERE type_id = 3 
AND adicional IS NOT NULL 
AND adicional::text LIKE '%id_objeto%'
AND (adicional->'id_clasificacion' IS NULL OR adicional->'id_clasificacion' = '[]');

-- Verificar el resultado final
SELECT 
    id_clasificacion,
    nombre,
    jsonb_array_length(COALESCE(adicional->'id_objeto', jsonb_build_array())) as total_objetos,
    jsonb_array_length(COALESCE(adicional->'id_clasificacion', jsonb_build_array())) as total_clasificaciones
FROM clasificacion 
WHERE type_id = 3 
ORDER BY id_clasificacion; 