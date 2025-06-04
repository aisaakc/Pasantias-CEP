import Persona from "../models/persona.js"

class PersonaController {
  

  async getUsuarios(req, res) {
        try {
            const usuarios = await Persona.getUsuarios();
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
            const roles = await Persona.getRoles();
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

    // async createPersona(req, res) {
    //     try {
    //         const personaData = req.body;
    //         const idPersona = await Persona.createPersonaWithRoles(personaData);
    //         res.status(201).json({
    //             success: true,
    //             data: { id_persona: idPersona },
    //             message: "Persona creada exitosamente"
    //         });
    //     } catch (error) {
    //         console.error("Error en createPersona controller:", error.message);
    //         res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

   
};
export default new PersonaController();