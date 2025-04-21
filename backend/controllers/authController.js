import UserModel from "../models/persona.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js"; 

// Definir las constantes para los IDs de rol basados en tu tabla clasificacion
const ROL_SUPERADMIN = 7; // ID para 'Super Administrador'
const ROL_ADMIN = 8;      // ID para 'Administrador'
const ROL_PARTICIPANTE = 11; 

const JWT_EXPIRES_IN = "2h"; 

class AuthController {
  
  async obtenerGeneros(req, res) {
    try {
      const generos = await UserModel.getGeneros();
      res.json(generos);
    } catch (error) { 
      console.error("Error en AuthController.obtenerGeneros:", error.message); 
      res.status(500).json({ error: "Error interno del servidor al obtener géneros." }); 
    }
  }

  async obtenerRoles(req, res) {
    try {
      const roles = await UserModel.getRoles();
      res.json(roles);
    } catch (error) { 
       console.error("Error en AuthController.obtenerRoles:", error.message); 
       res.status(500).json({ error: "Error interno del servidor al obtener roles." }); 
    }
  }

  async obtenerPreguntas(req, res) {
    try {
      const preguntas = await UserModel.getPreguntasSeguridad();
      res.json(preguntas);
    } catch (error) { 
      console.error("Error en AuthController.obtenerPreguntas:", error.message); 
      res.status(500).json({ error: "Error interno del servidor al obtener preguntas de seguridad." }); 
    }
  }

  async registrarUsuario(req, res) {
    const userData = {
       nombre: req.body.nombre,
       apellido: req.body.apellido,
       telefono: req.body.telefono,
       cedula: req.body.cedula,
       gmail: req.body.gmail,
       id_genero: req.body.id_genero,
       id_rol: req.body.id_rol, 
       id_pregunta: req.body.id_pregunta, 
       respuesta: req.body.respuesta, 
       contraseña: req.body.contraseña,
    };

    try {
      const userId = await UserModel.createUser(userData);
      res.status(201).json({ message: "Usuario registrado exitosamente.", userId: userId });
    } catch (error) {
      if (error.message.includes("La cédula ya está registrada.") || error.message.includes("El correo electrónico ya está registrado.") || error.message.includes("Faltan campos obligatorios")) {
           return res.status(400).json({ error: error.message });
      }
       console.error("Error en registrarUsuario:", error.message); 
      res.status(500).json({ error: "Error interno del servidor al registrar el usuario." });
    }
  }

  async loginUsuario(req, res) {
    // Ahora aceptamos cédula o gmail (o ambos) del cuerpo de la solicitud
    const { cedula, gmail, contraseña } = req.body; 

    try {
      // Pasamos cedula y gmail (si existen en el body) y contraseña al modelo
      const usuario = await UserModel.loginUser({ cedula, gmail, contraseña }); 

      const payload = {
        id_persona: usuario.id_persona, 
        nombre: usuario.nombre,
        gmail: usuario.gmail,
        id_rol: usuario.id_rol,       
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(200).json({
        message: `¡Bienvenido ${usuario.nombre} ${usuario.apellido}!`, 
        token,
        user: {
          id_persona: usuario.id_persona, 
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          gmail: usuario.gmail,
          id_rol: usuario.id_rol
        },
      });

    } catch (error) {
       if (error.message === "Credenciales incorrectas." || error.message === "Debe proporcionar cédula o correo electrónico, y la contraseña.") {
           return res.status(401).json({ error: error.message });
       }
       console.error("Error en loginUsuario:", error.message); 
      res.status(500).json({ error: "Error interno del servidor al iniciar sesión." });
    }
  }

  async crearAdministrador(req, res){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; 

    if(!token){
      return res.status(401).json({ error: "Token de autenticación no proporcionado."})
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if(decoded.id_rol !== ROL_SUPERADMIN ){ 
        return res.status(403).json({ error: "Acceso denegado. Solo el superadministrador puede crear administradores." });
      }

      const data = req.body;
      const adminData = {
           nombre: data.nombre,
           apellido: data.apellido,
           telefono: data.telefono,
           cedula: data.cedula,
           gmail: data.gmail,
           id_genero: data.id_genero,
           id_rol: data.id_rol,
           id_pregunta: data.id_pregunta, 
           respuesta: data.respuesta, 
           contraseña: data.contraseña,
      };


      if (adminData.id_rol !== ROL_ADMIN) {
        return res.status(400).json({ error: `Solo se pueden crear usuarios con rol de administrador (ID ${ROL_ADMIN}).` });
      }
       
      const userId = await UserModel.createUser(adminData); 
      res.status(201).json({ message: "Administrador creado correctamente.", userId: userId });

    } catch (error) {
       if (error.message.includes("La cédula ya está registrada.") || error.message.includes("El correo electrónico ya está registrada.") || error.message.includes("Faltan campos obligatorios")) {
           return res.status(400).json({ error: error.message });
      }
       console.error("Error en crearAdministrador:", error.message); 
       if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
           return res.status(401).json({ error: "Token inválido o expirado." });
       }
      res.status(500).json({ error: "Error interno del servidor al crear administrador." });
    }
  }

}

export default new AuthController();