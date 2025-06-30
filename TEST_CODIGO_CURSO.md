# Test: Estructura del Objeto Adicional para Cursos

## Estructura Esperada

Cuando se crea un curso, el objeto `adicional` debe tener la siguiente estructura:

```javascript
{
  "id": "CEP-01",        // Código generado automáticamente
  "costo": 12.50         // Costo ingresado por el usuario
}
```

## Ejemplos de Códigos Generados

### Cursos Normales
```javascript
{
  "id": "CEP-01",
  "costo": 25.00
}

{
  "id": "CEP-02", 
  "costo": 30.50
}

{
  "id": "CEP-03",
  "costo": 15.75
}
```

### Cursos Cisco Academy
```javascript
{
  "id": "CEP-CISCO-01",
  "costo": 45.00
}

{
  "id": "CEP-CISCO-02",
  "costo": 50.25
}

{
  "id": "CEP-CISCO-03", 
  "costo": 35.80
}
```

## Flujo de Generación

1. **Usuario completa nombre**: "Programación Web"
2. **Usuario selecciona programa**: "Cisco Academy" 
3. **Sistema genera código**: "CEP-CISCO-01"
4. **Usuario ingresa costo**: 45.00
5. **Sistema crea objeto adicional**:
   ```javascript
   {
     "id": "CEP-CISCO-01",
     "costo": 45.00
   }
   ```

## Verificación en Console

Los console.log mostrarán:
- `Código final a guardar: CEP-CISCO-01`
- `Costo a guardar: 45.00`
- `Objeto adicional final para curso: {id: "CEP-CISCO-01", costo: 45.00}`

## Validación

- ✅ El código se genera automáticamente
- ✅ El código se guarda en el campo `id`
- ✅ El costo se guarda en el campo `costo`
- ✅ La estructura es `{"id":"","costo":12}`
- ✅ Los códigos son únicos por programa
- ✅ Los códigos siguen el patrón correcto 