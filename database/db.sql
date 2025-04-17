
-- Adaptación a PostgreSQL del volcado MySQL

-- Tabla: clasificacion
CREATE TABLE clasificacion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(100),
  imagen VARCHAR(100),
  orden INTEGER,
  type_id INTEGER,
  parent_id INTEGER,
  facilitador_id INTEGER,
  duracion VARCHAR(255),
  horario VARCHAR(255),
  modalidad VARCHAR(255),
  costo NUMERIC(10,2)
);

-- Tabla: personas
CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(20) NOT NULL,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  id_genero INTEGER,
  id_rol INTEGER,
  telefono VARCHAR(20),
  contraseña VARCHAR(100),
  gmail VARCHAR(100),
  id_pregunta_seguridad INTEGER,
  respuesta_seguridad VARCHAR(100)
);

-- Relaciones (FOREIGN KEYS)
ALTER TABLE clasificacion
  ADD CONSTRAINT fk_clasificacion_type FOREIGN KEY (type_id) REFERENCES clasificacion(id),
  ADD CONSTRAINT fk_clasificacion_parent FOREIGN KEY (parent_id) REFERENCES clasificacion(id),
  ADD CONSTRAINT fk_clasificacion_facilitador FOREIGN KEY (facilitador_id) REFERENCES personas(id);

ALTER TABLE personas
  ADD CONSTRAINT fk_personas_genero FOREIGN KEY (id_genero) REFERENCES clasificacion(id),
  ADD CONSTRAINT fk_personas_rol FOREIGN KEY (id_rol) REFERENCES clasificacion(id),
  ADD CONSTRAINT fk_personas_pregunta FOREIGN KEY (id_pregunta_seguridad) REFERENCES clasificacion(id);

  INSERT INTO clasificacion (id, nombre, type_id, parent_id)
VALUES
(1, 'Género', NULL, NULL),
(2, 'Roles', NULL, NULL),
(3, 'Masculino', 1, NULL),
(4, 'Femenino', 1, NULL),
(5, 'Super Administrador', 2, NULL),
(6, 'Administrador', 2, NULL),
(7, 'CAJA', 2, NULL),
(8, 'Administración', 2, NULL),
(9, 'Facilitador', 2, NULL),
(10, 'Participante', 2, NULL),
(11, 'Participante Externo', 2, 10),
(12, 'Estudiante IUJO', 2, 10),
(13, 'Personal IUJO', 2, 10),
(14, 'Preguntas de Seguridad', NULL, NULL),
(15, '¿Cuál es el nombre de tu primera mascota?', 14, NULL),
(16, '¿Cuál es tu comida favorita?', 14, NULL),
(17, '¿En qué ciudad naciste?', 14, NULL),
(18, '¿Cómo se llama tu mejor amigo de la infancia?', 14, NULL);
