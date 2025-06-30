# Instrucciones para Probar la Generación de Códigos

## 🔍 **Diagnóstico del Problema**

Si el código no se genera cuando seleccionas un programa, sigue estos pasos para diagnosticar:

### 1. **Abrir la Consola del Navegador**
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña "Console"

### 2. **Crear un Nuevo Curso**
- Abre el modal para crear un nuevo curso
- Selecciona un programa de la lista

### 3. **Verificar los Logs en Consola**
Deberías ver estos mensajes:
```
Programa seleccionado: [ID_DEL_PROGRAMA]
formValues.type_id: [VALOR]
parentInfo?.type_id: [VALOR]
CLASSIFICATION_IDS.CURSOS: 5
¿Es un curso?: true/false
```

### 4. **Si No Ves los Logs**
- El problema está en que no se está ejecutando `handleProgramaChange`
- Verifica que el campo de programa esté visible

### 5. **Si Ves "¿Es un curso?: false"**
- El problema está en la detección del tipo de curso
- Verifica que `parentInfo?.type_id` sea igual a `5` (CURSOS)

### 6. **Usar el Botón de Prueba**
- Si seleccionaste un programa, aparecerá un botón azul "🔧 Generar Código Manualmente (Prueba)"
- Haz clic en él para generar el código manualmente
- Verifica los logs en consola

## 🛠️ **Posibles Soluciones**

### **Problema 1: No se detecta como curso**
```javascript
// Verificar en consola:
console.log('parentInfo:', parentInfo);
console.log('parentInfo.type_id:', parentInfo?.type_id);
console.log('CLASSIFICATION_IDS.CURSOS:', CLASSIFICATION_IDS.CURSOS);
```

### **Problema 2: No se encuentra el programa**
```javascript
// Verificar en consola:
console.log('programasConMascaras:', programasConMascaras);
console.log('programaId:', programaId);
```

### **Problema 3: Error en la API**
```javascript
// Verificar en consola si hay errores:
// "Error al generar código automático: [ERROR]"
```

## 📋 **Pasos de Prueba**

1. **Abrir modal de crear curso**
2. **Seleccionar programa** → Debería aparecer código automáticamente
3. **Si no aparece**, usar botón de prueba manual
4. **Verificar logs en consola** para identificar el problema
5. **Compartir los logs** si el problema persiste

## 🎯 **Resultado Esperado**

Cuando selecciones un programa, deberías ver:
- ✅ Código generado en el campo (ej: "CEP-01" o "CEP-CISCO-01")
- ✅ Campo resaltado en verde
- ✅ Mensaje "✓ Código generado automáticamente"
- ✅ Máscara mostrada (ej: "Máscara: CEP-999")

## 🔧 **Botón de Prueba Manual**

Si el código no se genera automáticamente, usa el botón azul "🔧 Generar Código Manualmente (Prueba)" que aparece cuando seleccionas un programa. Esto te ayudará a verificar si la función de generación funciona correctamente. 