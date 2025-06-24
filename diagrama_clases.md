# Diagrama de Clases - Sistema CEP

## Diagrama de Clases con Mermaid

```mermaid
classDiagram
    class Clasificacion {
        +getParentClassifications()
        +create(nuevaClasificacion)
        +getAllSubclasificaciones(type_id, parent_id)
        +getAllClasificaciones()
        +getAllIcons()
        +updateClasificacion(id, clasificacionActualizada)
        +delete(id)
        +getParentHierarchy(id_clasificacion)
    }

    class UsuarioModel {
        +getRoles()
        +getUsuarios()
        +CreateUsers(data)
        -#hashDato(dato, email)
        +updateUser(id_persona, data)
    }

    class UserModel {
        +getClassificationTypeId(typeName)
        +getSubclassificationsById(id)
        -#hashDato(dato, email)
        +createUser(data)
        +loginUser({cedula, gmail, contrasena})
    }

    class CursoModel {
        +getAllCursos(name)
        +getAllCursosById(id)
        +getAllCursosCompletos()
        +createCurso(cursoData)
        +updateCurso(id, cursoData)
        +updateHorariosCurso(id, horarios)
        +getFacilitadores()
    }

    class Documentos {
        +createDocumet(documento)
        +findAll()
        +findById(id_documento)
        +findByTipo(id_tipo)
        +update(id_documento, documento)
        +delete(id_documento)
        +count()
    }

    class ClasificacionDB {
        +id_clasificacion: integer
        +nombre: varchar
        +descripcion: varchar
        +imagen: varchar
        +orden: integer
        +type_id: bigint
        +parent_id: bigint
        +id_icono: bigint
        +adicional: json
        +protected: integer
    }

    class PersonasDB {
        +id_persona: integer
        +nombre: varchar
        +apellido: varchar
        +telefono: varchar
        +contrasena: varchar
        +id_genero: bigint
        +id_pregunta: bigint
        +cedula: integer
        +gmail: varchar
        +id_foto: bigint
        +id_status: bigint
        +respuesta: varchar
        +id_rol: json
    }

    class CursosDB {
        +id_curso: integer
        +id_nombre: bigint
        +id_type: bigint
        +id_status: bigint
        +duracion: double
        +descripcion_corto: varchar
        +descripcion_html: varchar
        +costo: double
        +codigo: varchar
        +id_facilitador: bigint
        +id_foto: bigint
        +id_modalidad: bigint
        +fecha_hora_inicio: timestamp
        +fecha_hora_fin: timestamp
        +color: varchar
        +partipantes: json
        +codigo_cohorte: varchar
        +horarios: json
        +propiedades_curso: json
    }

    class DocumentosDB {
        +id_documento: integer
        +id_tipo: bigint
        +fecha_hora: timestamp
        +nombre: varchar
        +descripcion: varchar
        +ext: varchar
        +tamano: bigint
    }

    class AuditoriasDB {
        +id_auditoria: integer
        +tabla: varchar
        +operacion: varchar
        +datos_anteriores: json
        +datos_nuevos: json
        +fecha_hora: timestamp
        +usuario: varchar
    }

    Clasificacion --> ClasificacionDB : "maneja"
    UsuarioModel --> PersonasDB : "gestiona usuarios"
    UserModel --> PersonasDB : "gestiona personas"
    CursoModel --> CursosDB : "gestiona cursos"
    Documentos --> DocumentosDB : "gestiona documentos"
    
    ClasificacionDB ||--o{ ClasificacionDB : "auto-referencia"
    PersonasDB }o--|| ClasificacionDB : "clasificaciones"
    CursosDB }o--|| ClasificacionDB : "clasificaciones"
    CursosDB }o--|| PersonasDB : "facilitador"
    DocumentosDB }o--|| ClasificacionDB : "tipo"
    
    UsuarioModel ..|> UserModel : "extiende"
```

## Descripción de las Clases

### Clases de Modelo (Business Logic)

1. **Clasificacion**: Maneja el sistema de clasificaciones jerárquicas
   - Gestiona tipos, categorías, roles, géneros, etc.
   - Permite crear, actualizar, eliminar y consultar clasificaciones
   - Maneja la jerarquía de clasificaciones padre-hijo

2. **UsuarioModel**: Gestiona operaciones específicas de usuarios
   - Creación y actualización de usuarios
   - Gestión de roles y permisos
   - Hashing de contraseñas y respuestas de seguridad

3. **UserModel**: Maneja operaciones de autenticación y gestión de personas
   - Login y autenticación de usuarios
   - Creación de nuevos usuarios
   - Gestión de datos personales

4. **CursoModel**: Gestiona toda la información relacionada con cursos
   - Creación, actualización y consulta de cursos
   - Gestión de facilitadores
   - Manejo de horarios y cohortes

5. **Documentos**: Administra el sistema de documentos
   - CRUD completo de documentos
   - Gestión de tipos de documento
   - Control de metadatos de archivos

### Entidades de Base de Datos

1. **ClasificacionDB**: Tabla principal para el sistema de clasificaciones jerárquicas
2. **PersonasDB**: Almacena información de usuarios y personas
3. **CursosDB**: Gestiona información de cursos y capacitaciones
4. **DocumentosDB**: Metadatos de documentos del sistema
5. **AuditoriasDB**: Registro de cambios y auditoría del sistema

### Características del Sistema

- **Sistema de Clasificaciones Jerárquico**: Permite crear categorías anidadas
- **Gestión de Usuarios Completa**: Registro, autenticación y roles
- **Sistema de Cursos**: Gestión completa de capacitaciones
- **Gestión de Documentos**: Control de archivos y metadatos
- **Auditoría**: Seguimiento de cambios en el sistema
- **Seguridad**: Hashing de contraseñas y validaciones

## Correcciones Realizadas

1. **Sintaxis Mermaid**: Se eliminaron los comentarios `%%` que causaban problemas
2. **Relaciones simplificadas**: Se simplificaron las etiquetas de relaciones para mayor compatibilidad
3. **Estructura limpia**: Se mantuvo solo la estructura esencial del diagrama
4. **Compatibilidad**: El diagrama ahora es compatible con la mayoría de renderizadores Mermaid 