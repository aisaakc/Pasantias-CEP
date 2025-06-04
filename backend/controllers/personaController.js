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


};
export default new PersonaController();