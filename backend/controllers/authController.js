import UserModel from "../models/persona.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js"; 
 
class AuthController {
  
  // async obtenerGeneros(req, res) {
  //   try {
  //     const generos = await UserModel.getGeneros();
  //     res.json(generos);
  //   } catch (error) { 
  //     console.error("Error en AuthController.obtenerGeneros:", error.message); 
  //     res.status(500).json({ error: "Error interno del servidor al obtener géneros." }); 
  //   }
  // }

  // async obtenerRoles(req, res) {
  //   try {
  //     const roles = await UserModel.getRoles();
  //     res.json(roles);
  //   } catch (error) { 
  //      console.error("Error en AuthController.obtenerRoles:", error.message); 
  //      res.status(500).json({ error: "Error interno del servidor al obtener roles." }); 
  //   }
  // }

  // async obtenerPreguntas(req, res) {
  //   try {
  //     const preguntas = await UserModel.getPreguntasSeguridad();
  //     res.json(preguntas);
  //   } catch (error) { 
  //     console.error("Error en AuthController.obtenerPreguntas:", error.message); 
  //     res.status(500).json({ error: "Error interno del servidor al obtener preguntas de seguridad." }); 
  //   }
  // }

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
      if (error.message.includes("La cédula ya está registrada.") || error.message.includes("El correo electrónico ya está registrado.")
         || error.message.includes("Faltan campos obligatorios")) {
           return res.status(400).json({ error: error.message });
      }
       console.error("Error en registrarUsuario:", error.message); 
      res.status(500).json({ error: "Error interno del servidor al registrar el usuario." });
    }
  }

  async loginUsuario(req, res) {
  
    const { cedula, gmail, contraseña } = req.body; 

    try {
     
      const usuario = await UserModel.loginUser({ cedula, gmail, contraseña }); 

      const payload = {
        id_persona: usuario.id_persona, 
        nombre: usuario.nombre,
        gmail: usuario.gmail,
        id_rol: usuario.id_rol,       
      };

      const token = jwt.sign(payload, JWT_SECRET);

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

  async getSubclassificationsById (req, res){
    try {
      const id = parseInt(req.params.id); 
      const getSubclassificationsById = await UserModel.getSubclassificationsById(id);
      res.json(getSubclassificationsById);

    } catch (error) {
      console.error("Error en authcontroller: ", error.message);
      res.status(500).json({ error: "Error al buscar subclasificacion." });
    }
  }
  
}

export default new AuthController();