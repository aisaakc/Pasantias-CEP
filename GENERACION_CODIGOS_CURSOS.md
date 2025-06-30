# Generación Automática de Códigos para Cursos

## Funcionamiento

El sistema genera automáticamente códigos únicos para los cursos **inmediatamente cuando se selecciona un programa**. Los códigos se generan basándose en el programa seleccionado y siguen un patrón específico.

## Patrones de Códigos

### 1. Cursos Normales (No Cisco)
- **Patrón**: `CEP-XX`
- **Ejemplos**: 
  - CEP-01
  - CEP-02
  - CEP-03
  - ...

### 2. Cursos de Cisco Academy
- **Patrón**: `CEP-CISCO-XX`
- **Ejemplos**:
  - CEP-CISCO-01
  - CEP-CISCO-02
  - CEP-CISCO-03
  - ...

## Cómo Funciona

1. **Selección del Programa**: El usuario selecciona un programa de la lista desplegable.

2. **Detección Automática**: El sistema detecta automáticamente si el programa seleccionado contiene la palabra "cisco" (sin distinguir mayúsculas/minúsculas).

3. **Selección de Máscara**: 
   - Si contiene "cisco" → Usa máscara `CEP-CISCO-999`
   - Si no contiene "cisco" → Usa máscara `CEP-999`

4. **Búsqueda de Códigos Existentes**: El sistema busca todos los cursos existentes del programa seleccionado y extrae sus códigos.

5. **Filtrado por Patrón**: Solo considera códigos que siguen el patrón correcto de la máscara.

6. **Cálculo del Siguiente Número**: Encuentra el número más alto existente y le suma 1.

7. **Generación del Código**: Combina la máscara con el número calculado, rellenando con ceros a la izquierda si es necesario.

## Cuándo se Genera

El código se genera automáticamente cuando:
- Se está creando un nuevo curso (no en edición)
- Se selecciona un "Programa"
- El tipo de clasificación es "CURSOS"

**Nota**: No es necesario completar el campo "Nombre" para que se genere el código.

## Ejemplo de Flujo

1. Usuario selecciona programa: "Cisco Academy"
2. Sistema detecta "cisco" en el nombre del programa
3. Sistema busca cursos existentes de Cisco Academy
4. Encuentra códigos: ["CEP-CISCO-01", "CEP-CISCO-03"]
5. Calcula siguiente número: max(1, 3) + 1 = 4
6. Genera código: "CEP-CISCO-04"
7. **El código aparece inmediatamente en el campo**

## Características

- **Generación Inmediata**: El código aparece instantáneamente al seleccionar el programa
- **Autoincremental**: Cada nuevo curso obtiene el siguiente número disponible
- **Único por Programa**: Los códigos son únicos dentro de cada programa
- **Formato Consistente**: Siempre usa el formato correcto según el tipo de programa
- **Validación**: Solo acepta códigos que siguen el patrón correcto
- **Feedback Visual**: Muestra confirmación de que se generó correctamente

## Estructura del Objeto Adicional

El código generado se guarda en el objeto `adicional` con la estructura:

```javascript
{
  "id": "CEP-CISCO-01",  // ← Código generado automáticamente
  "costo": 45.00         // ← Costo ingresado por el usuario
}
```

## Archivos Relacionados

- `client/src/components/Modal.jsx`: Lógica principal de generación
- `client/src/config/classificationIds.js`: IDs de clasificaciones
- `client/src/store/clasificacionStore.js`: Store para manejo de datos 