# Eliminación de Tiptap y Quill - Vuelta a Editor Simple

## Descripción

Se ha eliminado la integración de Tiptap y Quill del proyecto y se ha vuelto a un editor de texto simple usando un `textarea` HTML nativo para el campo "Contenido del Curso" en el modal `ModalCurso.jsx`.

## Cambios Realizados

### 1. **Eliminación de Dependencias**
Se removieron las siguientes dependencias del `package.json`:
- `@tiptap/react`
- `@tiptap/pm`
- `@tiptap/starter-kit`
- `@tiptap/extension-placeholder`
- `@tiptap/extension-text-align`
- `@tiptap/extension-underline`
- `@tiptap/extension-link`
- `@tiptap/extension-image`
- `@tiptap/extension-table`
- `@tiptap/extension-table-row`
- `@tiptap/extension-table-cell`
- `@tiptap/extension-table-header`
- `quill`

### 2. **Simplificación del Editor**
- Se reemplazó el editor Tiptap con un `textarea` HTML nativo
- Se eliminó la barra de herramientas compleja
- Se simplificó la interfaz de usuario
- Se mantuvieron los estilos de Tailwind CSS

### 3. **Limpieza de Código**
- Se eliminaron todas las importaciones de Tiptap
- Se removieron los estilos CSS específicos de Tiptap
- Se eliminó el archivo de prueba `TiptapTest.jsx`
- Se limpiaron las importaciones de iconos no utilizados

## Editor Actual

### Características del Textarea
- **Altura mínima**: 200px
- **Redimensionable**: Verticalmente
- **Estilos**: Consistentes con el diseño Tailwind
- **Placeholder**: "Escribe el contenido del curso aquí..."
- **Funcionalidad**: Guarda el contenido como texto plano

### Código del Editor
```jsx
<textarea
  value={descripcionHtml}
  onChange={(e) => setDescripcionHtml(e.target.value)}
  className="w-full min-h-[200px] px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white transition-colors
    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
    hover:border-blue-300 resize-vertical"
  placeholder="Escribe el contenido del curso aquí..."
/>
```

## Ventajas del Editor Simple

1. **Simplicidad**: Sin dependencias externas complejas
2. **Rendimiento**: Más rápido y ligero
3. **Compatibilidad**: Funciona en todos los navegadores
4. **Mantenimiento**: Fácil de mantener y debuggear
5. **Estabilidad**: Sin problemas de inicialización

## Desventajas

1. **Funcionalidad limitada**: Solo texto plano
2. **Sin formato**: No hay negrita, cursiva, listas, etc.
3. **Sin HTML**: No se puede insertar contenido HTML

## Próximas Opciones

Si en el futuro se necesita un editor más avanzado, se pueden considerar:

1. **TinyMCE**: Ya está instalado en el proyecto
2. **Summernote**: También disponible
3. **Lexical**: Facebook's editor (ya instalado)
4. **Slate**: Editor personalizable (ya instalado)

## Instalación de Dependencias

Para limpiar completamente las dependencias eliminadas:

```bash
cd client
npm install
```

Esto actualizará el `node_modules` y eliminará las dependencias no utilizadas.

## Conclusión

El proyecto ahora tiene un editor simple y funcional que cumple con los requisitos básicos sin la complejidad de editores externos. Esto mejora la estabilidad y el rendimiento de la aplicación. 