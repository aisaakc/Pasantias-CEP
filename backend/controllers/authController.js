import UserModel from "../models/persona.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import EmailService from "../services/emailService.js";
import pool from "../db.js";

class AuthController {
  async registrarUsuario(req, res) {
    console.log('=== INICIO DE REGISTRO DE USUARIO ===');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

    const userData = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      cedula: req.body.cedula,
      gmail: req.body.gmail,
      id_genero: req.body.id_genero,
      id_rol: req.body.id_roles,
      id_pregunta: req.body.id_pregunta,
      respuesta: req.body.respuesta,
      contrasena: req.body.contrasena
    };

    console.log('Datos procesados:', JSON.stringify(userData, null, 2));

    // Validación detallada de campos
    const validaciones = {
      nombre: !userData.nombre ? 'Falta el nombre' : null,
      apellido: !userData.apellido ? 'Falta el apellido' : null,
      telefono: !userData.telefono ? 'Falta el teléfono' : null,
      cedula: !userData.cedula ? 'Falta la cédula' : null,
      gmail: !userData.gmail ? 'Falta el gmail' : null,
      id_genero: userData.id_genero === undefined ? 'Falta el id_genero' : null,
      id_rol: !Array.isArray(userData.id_rol) ? 'id_roles debe ser un array' : 
              userData.id_rol.length === 0 ? 'id_roles está vacío' : null,
      id_pregunta: userData.id_pregunta === undefined ? 'Falta el id_pregunta' : null,
      respuesta: !userData.respuesta ? 'Falta la respuesta' : null,
      contrasena: !userData.contrasena ? 'Falta la contrasena' : null
    };

    const errores = Object.entries(validaciones)
      .filter(([_, error]) => error !== null)
      .map(([campo, error]) => `${campo}: ${error}`);

    if (errores.length > 0) {
      console.log('Errores de validación:', errores);
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios o son inválidos",
        detalles: errores
      });
    }

    try {
      console.log('Intentando crear usuario con datos:', JSON.stringify(userData, null, 2));
      
      // Registrar el usuario
      const userId = await UserModel.createUser(userData);
      console.log('Usuario creado exitosamente con ID:', userId);

      // Enviar correo de bienvenida
      try {
        await EmailService.sendWelcomeEmail(userData.gmail, userData.nombre, userData.apellido);
        console.log('Correo de bienvenida enviado exitosamente');
      } catch (emailError) {
        console.error("Error al enviar correo de bienvenida:", emailError);
        // No fallamos el registro si falla el correo
      }

      res.status(201).json({ 
        success: true,
        message: "Usuario registrado exitosamente.", 
        userId: userId 
      });
    } catch (error) {
      console.error("Error en registrarUsuario:", error.message);
      if (error.message.includes("La cédula ya está registrada.") || 
          error.message.includes("El correo electrónico ya está registrado.") ||
          error.message.includes("Faltan campos obligatorios")) {
        return res.status(400).json({ 
          success: false,
          error: error.message,
          dbError: error.message,
          detail: error.detail || null
        });
      }
      res.status(500).json({ 
        success: false,
        error: "Error interno del servidor al registrar el usuario.",
        dbError: error.message,
        detail: error.detail || null
      });
    }
  }

  async loginUsuario(req, res) {
    const { cedula, gmail, contrasena, respuesta } = req.body;

    try {
      console.log('=== INICIO DE LOGIN ===');
      console.log('Credenciales recibidas:', { cedula, gmail });
      
      const usuario = await UserModel.loginUser({ cedula, gmail, contrasena, respuesta });
      console.log('Usuario encontrado:', {
        id: usuario.id_persona,
        nombre: usuario.nombre,
        roles: usuario.id_rol
      });

      // Obtener info de roles (nombre, icono) desde la tabla clasificacion
      let rolesInfo = [];
      if (Array.isArray(usuario.id_rol) && usuario.id_rol.length > 0) {
        // Consulta todos los roles del usuario
        const rolesQuery = `SELECT id_clasificacion, nombre, descripcion, id_icono FROM clasificacion WHERE id_clasificacion = ANY($1)`;
        const { rows } = await pool.query(rolesQuery, [usuario.id_rol]);
        // Obtener nombre del ícono
        const iconosQuery = `SELECT id_clasificacion, nombre FROM clasificacion WHERE id_clasificacion = ANY($1)`;
        const iconoIds = rows.map(r => r.id_icono).filter(Boolean);
        let iconos = [];
        if (iconoIds.length > 0) {
          const iconosResult = await pool.query(iconosQuery, [iconoIds]);
          iconos = iconosResult.rows;
        }
        rolesInfo = rows.map(r => ({
          id: r.id_clasificacion,
          nombre: r.nombre,
          descripcion: r.descripcion,
          icono: iconos.find(i => i.id_clasificacion === r.id_icono)?.nombre || null
        }));
      }

      const payload = {
        id_persona: usuario.id_persona,
        nombre: usuario.nombre,
        gmail: usuario.gmail,
        id_rol: usuario.id_rol,
        isSupervisor: usuario.isSupervisor || false
      };

      console.log('Payload del token:', payload);

      const token = jwt.sign(payload, JWT_SECRET);

      res.status(200).json({
        success: true,
        message: `¡Bienvenido ${usuario.nombre} ${usuario.apellido}!`,
        token,
        user: {
          id_persona: usuario.id_persona,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          gmail: usuario.gmail,
          id_rol: usuario.id_rol,
          isSupervisor: usuario.isSupervisor || false,
          rolesInfo
        },
      });
    } catch (error) {
      console.error("Error en loginUsuario:", error.message);
      if (error.message === "Credenciales incorrectas." || 
          error.message === "Debe proporcionar cédula o correo electrónico, y la contrasena.") {
        return res.status(401).json({ 
          success: false,
          error: error.message,
          dbError: error.message,
          detail: error.detail || null
        });
      }
      res.status(500).json({ 
        success: false,
        error: "Error interno del servidor al iniciar sesión.",
        dbError: error.message,
        detail: error.detail || null
      });
    }
  }

  async getSubclassificationsById(req, res) {
    try {
      const id = req.params.id;
      
      const subclassifications = await UserModel.getSubclassificationsById(id);
      
      return res.json({
        success: true,
        data: subclassifications
      });
    } catch (error) {
      console.error('Error en getSubclassificationsById:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
        dbError: error.message,
        detail: error.detail || null
      });
    }
  }
}

export default new AuthController();