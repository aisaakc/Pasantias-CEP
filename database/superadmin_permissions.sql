-- Script para configurar permisos del Superadministrador
-- Este script asigna TODOS los objetos y TODAS las clasificaciones al rol Superadministrador
-- Los elementos se generan dinámicamente desde la base de datos

-- Actualizar el rol Super Administrador con permisos dinámicos
UPDATE clasificacion
SET adicional = (
    SELECT jsonb_build_object(
        'id_objeto', (
            -- Obtener todos los IDs de clasificaciones que son de tipo objeto (type_id = 73)
            SELECT jsonb_agg(id_clasificacion)
            FROM clasificacion 
            WHERE type_id = 73
        ),
        'id_clasificacion', (
            -- Obtener todos los IDs de clasificaciones principales (type_id IS NULL)
            SELECT jsonb_agg(id_clasificacion)
            FROM clasificacion 
            WHERE type_id IS NULL
        )
    )
)
WHERE id_clasificacion = 15
AND type_id = 3;

-- Verificar que se actualizó correctamente
SELECT 
    id_clasificacion,
    nombre,
    jsonb_array_length(COALESCE(adicional->'id_objeto', jsonb_build_array())) as total_objetos,
    jsonb_array_length(COALESCE(adicional->'id_clasificacion', jsonb_build_array())) as total_clasificaciones,
    adicional
FROM clasificacion 
WHERE nombre = 'Super Administrador' 
AND type_id = 3;

-- Mostrar qué objetos se asignaron
SELECT 
    'OBJETOS ASIGNADOS' as tipo,
    id_clasificacion,
    nombre,
    type_id
FROM clasificacion 
WHERE type_id = 73
ORDER BY id_clasificacion;

-- Mostrar qué clasificaciones se asignaron
SELECT 
    'CLASIFICACIONES ASIGNADAS' as tipo,
    id_clasificacion,
    nombre,
    type_id
FROM clasificacion 
WHERE type_id IS NULL
ORDER BY id_clasificacion;

-- Script alternativo si necesitas insertar en lugar de actualizar
-- INSERT INTO clasificacion (nombre, descripcion, type_id, adicional) 
-- VALUES (
--     'Super Administrador',
--     'Rol con acceso completo a todas las funcionalidades del sistema',
--     3,
--     jsonb_build_object(
--         'id_objeto', jsonb_build_array(100066, 100141, 100142, 100164, 100171, 100154, 100067, 100157, 100158, 100159, 100068, 100160, 100162, 100166, 100167, 100156, 100161),
--         'id_clasificacion', jsonb_build_array(1, 3, 4, 5, 8, 27, 73, 96, 110, 122, 123, 124, 100050, 100059, 100094, 100121, 100172, 100173)
--     )
-- ); 