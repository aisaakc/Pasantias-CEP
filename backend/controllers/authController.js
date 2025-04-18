import UserModel from "../models/persona.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const JWT_EXPIRES_IN = "2h";
class AuthController {
  
  async obtenerGeneros(req, res) {
    try {
      const generos = await UserModel.getGeneros();
      res.json(generos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerRoles(req, res) {
    try {
      const roles = await UserModel.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPreguntas(req, res) {
    try {
      const preguntas = await UserModel.getPreguntasSeguridad();
      res.json(preguntas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async registrarUsuario(req, res) {
    try {
      const userId = await UserModel.createUser(req.body);
      res.status(201).json({ message: "Usuario registrado", userId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loginUsuario(req, res) {
    const { gmail, contraseña } = req.body;

    try {
      if (!gmail || !contraseña) {
        return res.status(400).json({ error: "Debe proporcionar el correo y la contraseña." });
      }

      const usuario = await UserModel.loginUser({ gmail, contraseña });

      const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        gmail: usuario.gmail,
        id_rol: usuario.id_rol,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(200).json({
        message: `¡Bienvenido ${usuario.nombre} ${usuario.apellido}!`,
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
        },
      });

    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async crearAdministrador(req, res){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(401).json({ error: "token no proporcionado"})
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if(decoded.id_rol !== 5 ){
        return res.status(403).json({ error: "Acceso denegado. Solo el superadministrador puede crear administradores." });
      }

      const data = req.body;

      if (data.id_rol !== 4) {
        return res.status(400).json({ error: "Solo se pueden crear usuarios con rol de administrador." });
      }

      const userId = await UserModel.createUser(data);
      res.status(201).json({ message: "Administrador creado correctamente", userId });

    } catch (error) {
      res.status(401).json({ error: "Token inválido o error: " + error.message });
    }
  }

}

export default new AuthController(); // Instancia lista para usar
