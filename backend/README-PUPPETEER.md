# 🚀 Configuración de Puppeteer para Generación de PDFs

Este documento explica cómo configurar Puppeteer para que funcione en **cualquier PC** y pueda generar certificados PDF.

## 📋 Requisitos Previos

- **Node.js** versión 16 o superior
- **npm** o **yarn** instalado
- **Windows 10/11**, **macOS 10.15+**, o **Linux** (Ubuntu 18.04+)

## 🔧 Instalación Automática (Recomendada)

### 1. Instalación con un comando
```bash
cd backend
npm run setup-puppeteer
```

Este comando:
- ✅ Verifica la versión de Node.js
- ✅ Detecta si Chrome está instalado en tu PC
- ✅ Instala navegadores incluidos con Puppeteer si es necesario
- ✅ Ejecuta una prueba para verificar que todo funciona
- ✅ Limpia archivos temporales

### 2. Instalación automática después de npm install
```bash
cd backend
npm install
# El script se ejecuta automáticamente después de instalar dependencias
```

## 🛠️ Instalación Manual

### Opción 1: Usar Chrome instalado en tu PC
Si ya tienes Google Chrome instalado, Puppeteer lo detectará automáticamente.

**Ventajas:**
- ✅ Más rápido (no descarga navegador adicional)
- ✅ Menos espacio en disco
- ✅ Actualizaciones automáticas con Chrome

**Desventajas:**
- ❌ Requiere Chrome instalado
- ❌ Puede tener problemas de compatibilidad con versiones muy nuevas

### Opción 2: Usar navegador incluido con Puppeteer
Si no tienes Chrome o prefieres usar el incluido:

```bash
cd backend
npx puppeteer browsers install chrome
```

**Ventajas:**
- ✅ Funciona en cualquier PC sin dependencias externas
- ✅ Versión compatible garantizada
- ✅ No interfiere con Chrome del sistema

**Desventajas:**
- ❌ Descarga ~200MB adicionales
- ❌ Puede ser más lento en la primera ejecución

## 🔍 Verificación de la Instalación

### 1. Verificar que Puppeteer esté instalado
```bash
cd backend
npm list puppeteer
```

### 2. Ejecutar prueba de funcionamiento
```bash
cd backend
npm run setup-puppeteer
```

### 3. Verificar en el navegador
- Abre la página de generación de certificados
- Haz clic en "Generar Certificado de Prueba"
- Debería generar y descargar un PDF

## 🚨 Solución de Problemas Comunes

### Error: "Could not find Chrome"
**Síntomas:**
```
Error: Could not find Chrome (ver. 127.0.6533.88)
```

**Soluciones:**
1. **Instalar Chrome** desde [google.com/chrome](https://google.com/chrome)
2. **Usar navegador incluido:**
   ```bash
   npx puppeteer browsers install chrome
   ```
3. **Verificar rutas de Chrome** en el sistema

### Error: "No se pudo conectar al servidor"
**Síntomas:**
```
Error: No se pudo conectar al servidor
```

**Soluciones:**
1. **Verificar que el backend esté ejecutándose:**
   ```bash
   cd backend
   npm run dev
   ```
2. **Verificar puerto 3001** no esté ocupado
3. **Revisar firewall** y antivirus

### Error: "La solicitud tardó demasiado tiempo"
**Síntomas:**
```
Error: La solicitud tardó demasiado tiempo
```

**Soluciones:**
1. **Aumentar timeout** en el frontend (ya configurado a 2 minutos)
2. **Verificar recursos del sistema** (CPU, RAM)
3. **Cerrar otras aplicaciones** que usen Chrome

### Error: "Error al generar PDF"
**Síntomas:**
```
Error: Error al generar PDF
```

**Soluciones:**
1. **Revisar logs del backend** para detalles específicos
2. **Verificar permisos** de escritura en la carpeta temporal
3. **Reiniciar el servidor** backend

## 🖥️ Configuración por Sistema Operativo

### Windows
- **Chrome:** Se instala automáticamente en `Program Files`
- **Rutas comunes:**
  - `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
- **Permisos:** Ejecutar como administrador si hay problemas

### macOS
- **Chrome:** Se instala en `/Applications`
- **Ruta:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- **Permisos:** Permitir acceso en Preferencias del Sistema > Seguridad y Privacidad

### Linux (Ubuntu/Debian)
- **Instalar Chrome:**
  ```bash
  wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
  sudo apt update
  sudo apt install google-chrome-stable
  ```
- **Ruta:** `/usr/bin/google-chrome-stable`

## 📊 Monitoreo y Logs

### Logs del Backend
Los logs muestran información detallada:
```
✅ Navegador encontrado en: C:\Program Files\Google\Chrome\Application\chrome.exe
✅ Usando Chrome instalado en el sistema
✅ Navegador iniciado exitosamente
✅ PDF generado exitosamente
```

### Logs del Frontend
El frontend muestra:
- Estado de carga
- Mensajes de éxito/error
- Sugerencias para resolver problemas

## 🔄 Actualizaciones

### Actualizar Puppeteer
```bash
cd backend
npm update puppeteer
npm run setup-puppeteer
```

### Actualizar Chrome del sistema
- **Windows:** Chrome se actualiza automáticamente
- **macOS:** App Store o descarga directa
- **Linux:** `sudo apt update && sudo apt upgrade google-chrome-stable`

## 📞 Soporte

### Si tienes problemas:
1. **Revisa los logs** del backend y frontend
2. **Ejecuta el script de configuración:**
   ```bash
   npm run setup-puppeteer
   ```
3. **Verifica la versión de Node.js:**
   ```bash
   node --version
   ```
4. **Revisa este README** para soluciones comunes

### Información del sistema útil:
```bash
node --version
npm --version
npx puppeteer --version
```

## 🎯 Resumen de Comandos Útiles

```bash
# Configurar Puppeteer
npm run setup-puppeteer

# Instalar navegador incluido
npx puppeteer browsers install chrome

# Verificar instalación
npm list puppeteer

# Ejecutar backend
npm run dev

# Generar PDF de prueba
# (Desde el frontend en /dashboard/prueba)
```

---

**¡Con esta configuración, Puppeteer funcionará en cualquier PC!** 🎉
