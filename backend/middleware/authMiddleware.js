// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Asegúrate de que JWT_SECRET se exporte desde tu config.js

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  // Obtener el encabezado de autorización
  const authHeader = req.headers['authorization'];
  // El formato esperado es "Bearer TOKEN", extraemos el TOKEN
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, retornar 401 No autorizado
  if (token == null) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // Si hay un error (token inválido, expirado, etc.), retornar 403 Prohibido
    if (err) {
      console.error("Error de verificación JWT:", err.message);
      return res.status(403).json({ error: 'Token de autenticación inválido o expirado.' });
    }

    // Si el token es válido, el objeto 'decoded' contiene el payload del JWT.
    // Adjuntamos el payload decodificado al objeto request para usarlo en las rutas/controladores
    req.user = decoded; // req.user contendrá { id_persona, nombre, gmail, id_rol, iat, exp }

    // Continuar al siguiente middleware o al manejador de la ruta
    next();
  });
};

// Middleware opcional para control de acceso basado en roles (RBAC)
// Este middleware asume que authMiddleware ya se ejecutó antes y req.user está disponible
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // authMiddleware debe haber adjuntado req.user
        // Si no hay usuario o no tiene un rol, es un error de lógica o authMiddleware falló
        if (!req.user || !req.user.id_rol) {
            // Esto no debería ocurrir si authMiddleware se usa correctamente antes
            return res.status(401).json({ error: 'Autenticación requerida para verificar rol.' });
        }

        // Verificar si el rol del usuario autenticado está en la lista de roles permitidos
        if (!allowedRoles.includes(req.user.id_rol)) {
            // 403 Prohibido - El usuario está autenticado pero su rol no tiene permiso
            return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
        }

        // Si el rol está permitido, continuar
        next();
    };
};


// Exportar los middlewares
export { authMiddleware, roleMiddleware };