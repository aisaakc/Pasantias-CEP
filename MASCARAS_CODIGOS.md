# Configuración de Máscaras de Códigos para Cursos

## Descripción

El sistema de códigos automáticos para cursos permite generar códigos únicos basados en máscaras definidas en los institutos y programas. Los códigos siguen una jerarquía donde:

1. **Si el programa tiene su propia máscara**: Se usa la máscara del programa
2. **Si el programa no tiene máscara pero el instituto sí**: Se usa la máscara del instituto
3. **Si ninguno tiene máscara**: Se usa la máscara por defecto `CEP-999`

## Formato de Máscaras

Las máscaras usan el formato `999` para representar números autoincrementables:

- `CEP-999` → CEP-001, CEP-002, CEP-003...
- `CEP-CISCO-999` → CEP-CISCO-001, CEP-CISCO-002, CEP-CISCO-003...
- `INSTITUTO-999` → INSTITUTO-001, INSTITUTO-002, INSTITUTO-003...

## Configuración en la Base de Datos

### Para Institutos

En la tabla `clasificacion`, para registros con `type_id = 200` (INSTITUTOS), configurar el campo `adicional`:

```json
{
  "mask": "CEP-999"
}
```

### Para Programas

En la tabla `clasificacion`, para registros con `type_id = 4` (PROGRAMAS), configurar el campo `adicional`:

```json
{
  "mask": "CEP-CISCO-999"
}
```

## Ejemplos de Configuración

### Instituto IJUO Catia
```json
{
  "mask": "CEP-999"
}
```
**Resultado**: Los cursos de programas sin máscara propia tendrán códigos como CEP-001, CEP-002, etc.

### Programa Cisco Academy
```json
{
  "mask": "CEP-CISCO-999"
}
```
**Resultado**: Los cursos de este programa tendrán códigos como CEP-CISCO-001, CEP-CISCO-002, etc.

### Programa sin máscara propia
Si un programa no tiene máscara en su campo `adicional`, heredará la máscara del instituto padre.

## Funcionamiento del Sistema

1. **Al seleccionar un programa**: El sistema busca automáticamente la máscara apropiada
2. **Generación de código**: Se obtienen todos los códigos existentes del programa y se genera el siguiente número disponible
3. **Validación**: El código generado se valida contra la máscara para asegurar el formato correcto
4. **Autoincremento**: Los números se incrementan automáticamente (001, 002, 003...)

## Ventajas

- **Consistencia**: Todos los cursos de un programa siguen el mismo patrón de códigos
- **Flexibilidad**: Cada programa puede tener su propia máscara
- **Herencia**: Los programas heredan la máscara del instituto si no tienen una propia
- **Automatización**: No es necesario ingresar códigos manualmente
- **Unicidad**: Garantiza que no haya códigos duplicados

## Notas Técnicas

- Los códigos se generan automáticamente al seleccionar un programa
- Se puede regenerar el código usando el botón "Regenerar"
- En modo edición, el campo de código es editable
- En modo creación, el campo es de solo lectura una vez generado el código 