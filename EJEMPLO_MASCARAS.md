# Ejemplo Práctico: Configuración de Máscaras de Códigos

## Configuración en la Base de Datos

### 1. Configurar Instituto IJUO Catia

En la tabla `clasificacion`, buscar el registro del instituto IJUO Catia (type_id = 200) y actualizar el campo `adicional`:

```sql
UPDATE clasificacion 
SET adicional = '{"mask": "CEP-999"}'::jsonb
WHERE nombre = 'IJUO Catia' AND type_id = 200;
```

### 2. Configurar Programa Cisco Academy

En la tabla `clasificacion`, buscar el registro del programa Cisco Academy (type_id = 4) y actualizar el campo `adicional`:

```sql
UPDATE clasificacion 
SET adicional = '{"mask": "CEP-CISCO-999"}'::jsonb
WHERE nombre = 'Cisco Academy' AND type_id = 4;
```

### 3. Programa sin máscara propia

Dejar el campo `adicional` vacío o sin la propiedad `mask` para que herede la máscara del instituto:

```sql
UPDATE clasificacion 
SET adicional = '{}'::jsonb
WHERE nombre = 'Programa Sin Máscara' AND type_id = 4;
```

## Prueba de la Funcionalidad

### Escenario 1: Programa con máscara propia

1. **Configurar**: Programa Cisco Academy con máscara `CEP-CISCO-999`
2. **Crear curso**: Seleccionar el programa Cisco Academy
3. **Resultado esperado**: 
   - Código generado: `CEP-CISCO-001`
   - Máscara mostrada: `CEP-CISCO-999`
   - Próximo código: `CEP-CISCO-002`

### Escenario 2: Programa sin máscara (hereda del instituto)

1. **Configurar**: 
   - Instituto IJUO Catia con máscara `CEP-999`
   - Programa sin máscara propia
2. **Crear curso**: Seleccionar el programa sin máscara
3. **Resultado esperado**:
   - Código generado: `CEP-001`
   - Máscara mostrada: `CEP-999`
   - Próximo código: `CEP-002`

### Escenario 3: Sin máscaras configuradas

1. **Configurar**: Sin máscaras en instituto ni programa
2. **Crear curso**: Seleccionar cualquier programa
3. **Resultado esperado**:
   - Código generado: `CEP-001`
   - Máscara mostrada: `CEP-999` (máscara por defecto)
   - Próximo código: `CEP-002`

## Verificación en la Base de Datos

### Verificar códigos generados

```sql
SELECT 
  c.nombre as curso,
  c.adicional->>'id' as codigo,
  p.nombre as programa,
  i.nombre as instituto
FROM clasificacion c
LEFT JOIN clasificacion p ON c.parent_id = p.id_clasificacion
LEFT JOIN clasificacion i ON p.parent_id = i.id_clasificacion
WHERE c.type_id = 5  -- CURSOS
ORDER BY c.adicional->>'id';
```

### Verificar máscaras configuradas

```sql
-- Máscaras de institutos
SELECT 
  nombre,
  adicional->>'mask' as mascara
FROM clasificacion 
WHERE type_id = 200  -- INSTITUTOS
  AND adicional->>'mask' IS NOT NULL;

-- Máscaras de programas
SELECT 
  nombre,
  adicional->>'mask' as mascara
FROM clasificacion 
WHERE type_id = 4  -- PROGRAMAS
  AND adicional->>'mask' IS NOT NULL;
```

## Casos de Uso Comunes

### 1. Instituto con múltiples programas

```
Instituto: IJUO Catia (máscara: CEP-999)
├── Programa A (sin máscara) → CEP-001, CEP-002...
├── Programa B (máscara: CEP-B-999) → CEP-B-001, CEP-B-002...
└── Programa C (sin máscara) → CEP-003, CEP-004...
```

### 2. Programas especializados

```
Programa: Cisco Academy (máscara: CEP-CISCO-999)
├── Curso 1 → CEP-CISCO-001
├── Curso 2 → CEP-CISCO-002
└── Curso 3 → CEP-CISCO-003
```

### 3. Programas con prefijos específicos

```
Programa: Microsoft Office (máscara: CEP-MSO-999)
├── Word → CEP-MSO-001
├── Excel → CEP-MSO-002
└── PowerPoint → CEP-MSO-003
```

## Notas Importantes

1. **Unicidad**: Los códigos son únicos por programa
2. **Autoincremento**: Los números se incrementan automáticamente
3. **Herencia**: Los programas heredan la máscara del instituto si no tienen una propia
4. **Flexibilidad**: Cada programa puede tener su propia máscara
5. **Validación**: El sistema valida que los códigos sigan el formato de la máscara 