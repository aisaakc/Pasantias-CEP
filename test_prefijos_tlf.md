# Prueba de Funcionalidad PREFIJOS_TLF

## Descripción
Se ha implementado la funcionalidad para manejar el campo checkbox "Es un número móvil" cuando se crea o edita una clasificación con el ID PREFIJOS_TLF (100190).

## Cambios Implementados

### Frontend (Modal.jsx)
1. **Importación del ícono**: Se agregó `faMobile` a las importaciones de FontAwesome
2. **Valores iniciales**: Se agregó `isMobile: editData?.adicional?.mobile || false` a los valores iniciales del formulario
3. **Lógica de envío**: Se agregó la lógica para manejar el campo `isMobile` cuando `type_id` es PREFIJOS_TLF
4. **Interfaz de usuario**: Se agregó la sección del checkbox con el ícono de móvil

### Backend
1. **Configuración**: Se agregó `PREFIJOS_TLF: 100190` al archivo de configuración
2. **Modelo**: El modelo ya maneja correctamente el campo `adicional` como JSON
3. **Controlador**: El controlador ya pasa correctamente el campo `adicional` al modelo

## Cómo Probar

### 1. Crear una nueva clasificación PREFIJOS_TLF
1. Ir a la sección de clasificaciones
2. Buscar "PREFIJOS_TLF" o navegar a la clasificación con ID 100190
3. Hacer clic en "Agregar" para crear una nueva subclasificación
4. Verificar que aparece el campo checkbox "Es un número móvil"
5. Marcar el checkbox
6. Guardar la clasificación
7. Verificar en la base de datos que se guardó como `{"mobile": true}`

### 2. Editar una clasificación PREFIJOS_TLF existente
1. Buscar una clasificación existente de PREFIJOS_TLF
2. Hacer clic en "Editar"
3. Verificar que el checkbox aparece y muestra el valor correcto
4. Cambiar el valor del checkbox
5. Guardar los cambios
6. Verificar que se actualizó correctamente en la base de datos

### 3. Verificar en la Base de Datos
```sql
-- Verificar que se guardó correctamente
SELECT id_clasificacion, nombre, adicional 
FROM clasificacion 
WHERE type_id = 100190 
AND adicional IS NOT NULL;
```

## Estructura de Datos Esperada

### Para números móviles:
```json
{
  "mobile": true
}
```

### Para números fijos:
```json
{
  "mobile": false
}
```

## Casos de Prueba

1. **Crear con checkbox marcado**: Debe guardar `{"mobile": true}`
2. **Crear con checkbox desmarcado**: Debe guardar `{"mobile": false}`
3. **Editar y cambiar de true a false**: Debe actualizar a `{"mobile": false}`
4. **Editar y cambiar de false a true**: Debe actualizar a `{"mobile": true}`
5. **Verificar que solo aparece para PREFIJOS_TLF**: El checkbox no debe aparecer para otras clasificaciones

## Notas Técnicas

- El campo se almacena en la columna `adicional` de tipo JSON
- La validación es opcional (no es requerido)
- El valor por defecto es `false`
- La funcionalidad solo se activa cuando `type_id` es 100190 (PREFIJOS_TLF) 