-- Crear tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL
);

-- Insertar roles iniciales
INSERT INTO roles (rol) VALUES 
('admin'), 
('participante');

-- Crear tabla de tipo de participante
CREATE TABLE tipo_participante (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- Insertar tipos de participante
INSERT INTO tipo_participante (tipo) VALUES 
('estudiante IUJO'), 
('participante externo'), 
('personal IUJO');

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    tipo_participante_id INTEGER REFERENCES tipo_participante(id)
);

