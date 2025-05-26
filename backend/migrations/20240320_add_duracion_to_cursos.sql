-- Agregar columna duracion a la tabla cursos
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS duracion INTEGER;

-- Actualizar registros existentes con un valor por defecto
UPDATE cursos SET duracion = 0 WHERE duracion IS NULL; 