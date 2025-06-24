-- Script para actualizar las descripciones de prefijos telefónicos en Ecuador
-- Ejecutar después de que se hayan creado los prefijos con el campo adicional.mobile

-- Prefijos móviles (mobile: true)
UPDATE clasificacion 
SET descripcion = 'Claro Móvil' 
WHERE type_id = 100190 AND nombre = '0992' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Claro Móvil' 
WHERE type_id = 100190 AND nombre = '0993' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Claro Móvil' 
WHERE type_id = 100190 AND nombre = '0994' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Movistar Móvil' 
WHERE type_id = 100190 AND nombre = '0984' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Movistar Móvil' 
WHERE type_id = 100190 AND nombre = '0985' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Movistar Móvil' 
WHERE type_id = 100190 AND nombre = '0986' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'CNT Móvil' 
WHERE type_id = 100190 AND nombre = '0987' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'CNT Móvil' 
WHERE type_id = 100190 AND nombre = '0988' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'CNT Móvil' 
WHERE type_id = 100190 AND nombre = '0989' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Tuenti Móvil' 
WHERE type_id = 100190 AND nombre = '0990' AND adicional->>'mobile' = 'true';

UPDATE clasificacion 
SET descripcion = 'Tuenti Móvil' 
WHERE type_id = 100190 AND nombre = '0991' AND adicional->>'mobile' = 'true';

-- Prefijos fijos (mobile: false)
UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '022' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '023' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '024' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '025' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '026' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '027' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '028' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'Claro Fijo' 
WHERE type_id = 100190 AND nombre = '029' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '032' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '033' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '034' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '035' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '036' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '037' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '038' AND adicional->>'mobile' = 'false';

UPDATE clasificacion 
SET descripcion = 'CNT Fijo' 
WHERE type_id = 100190 AND nombre = '039' AND adicional->>'mobile' = 'false';

-- Verificar los cambios
SELECT id_clasificacion, nombre, descripcion, adicional 
FROM clasificacion 
WHERE type_id = 100190 
ORDER BY 
  CASE WHEN adicional->>'mobile' = 'true' THEN 0 ELSE 1 END,
  CAST(nombre AS INTEGER); 