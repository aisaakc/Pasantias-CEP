-- Crear tabla 'usuario' si no existe
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  cedula INTEGER UNIQUE NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(15),
  tipo_participante VARCHAR(30) CHECK (tipo_participante IN ('estudiante IUJO', 'Participante Externo', 'Personal IUJO')),
  genero VARCHAR(10) CHECK (genero IN ('Masculino', 'Femenino')),
  rol VARCHAR(50) DEFAULT 'Participante',
  contraseña VARCHAR(255) NOT NULL,
  asignado_por_usuario_id INTEGER,
  FOREIGN KEY (asignado_por_usuario_id) REFERENCES usuario (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
