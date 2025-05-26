// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; 

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
  
    if (err) {
      console.error("Error de verificación JWT:", err.message);
      return res.status(403).json({ error: 'Token de autenticación inválido o expirado.' });
    }

    req.user = decoded; 

    next();
  });
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.id_rol || !req.user.id_rol.id_rol) {
      return res.status(401).json({ error: 'Autenticación requerida para verificar rol.' });
    }

    // Verificamos si alguno de los roles del usuario está en los roles permitidos
    const userRoles = req.user.id_rol.id_rol;
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }

    next();
  };
};

export { authMiddleware, roleMiddleware };