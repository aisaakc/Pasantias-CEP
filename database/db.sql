CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(15),
  tipo_participante VARCHAR(30) NOT NULL,
  genero VARCHAR(10) NOT NULL,
  rol VARCHAR(50) DEFAULT 'Participante',
  contraseña VARCHAR(255) NOT NULL,
  asignado_por_usuario_id INTEGER,
  
  CONSTRAINT usuario_genero_check CHECK (
    genero IN ('Masculino', 'Femenino')
  ),
  
  CONSTRAINT usuario_tipo_participante_check CHECK (
    LOWER(tipo_participante) IN ('estudiante iujo', 'participante externo', 'personal iujo')
  ),
  
  CONSTRAINT fk_asignado_por FOREIGN KEY (asignado_por_usuario_id)
    REFERENCES usuario (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
