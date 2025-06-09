import UsuarioModel from "../models/usuarios.js"
class PersonaController {
  

  async getUsuarios(req, res) {
        try {
            const usuarios = await UsuarioModel.getUsuarios();
            res.status(200).json({
                success: true,
                data: usuarios,
                message: "Usuarios obtenidos exitosamente"
            });
        } catch (error) {
            console.error("Error en getUsuarios controller:", error.message);
            res.status(500).json({
                success: false,
                message: "Error al obtener los usuarios",
                error: error.message
            });
        }
    }

    async getRoles(req, res) {
        try {
            const roles = await UsuarioModel.getRoles();
            res.status(200).json({
                success: true,
                data: roles
            });
        } catch (error) {
            console.error('Error al obtener roles:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los roles',
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const newUserId = await UsuarioModel.CreateUsers(userData);
            
            res.status(201).json({
                success: true,
                data: { id_persona: newUserId },
                message: "Usuario creado exitosamente"
            });
        } catch (error) {
            console.error("Error en createUser controller:", error.message);
            
            // Manejar errores específicos
            if (error.message.includes("Faltan campos obligatorios")) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes("ya está registrada") || 
                error.message.includes("ya existe")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: "Error al crear el usuario",
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID de usuario no proporcionado"
                });
            }

            const updatedUserId = await UsuarioModel.updateUser(id, userData);
            
            res.status(200).json({
                success: true,
                data: { id_persona: updatedUserId },
                message: "Usuario actualizado exitosamente"
            });
        } catch (error) {
            console.error("Error en updateUser controller:", error.message);
            
            if (error.message.includes("no encontrado")) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes("ya está registrada") || 
                error.message.includes("ya existe")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: "Error al actualizar el usuario",
                error: error.message
            });
        }
    }

};
export default new PersonaController();