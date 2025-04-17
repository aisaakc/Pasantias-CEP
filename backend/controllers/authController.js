import { createUser } from '../models/persona.js'; // Importa la función del modelo

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { 
    nombre, 
    apellido, 
    telefono, 
    cedula, 
    id_genero, 
    id_rol, 
    id_pregunta_seguridad, 
    respuesta_seguridad, 
    contraseña, 
    gmail 
  } = req.body;

  // Validación de campos
  if (!nombre || !apellido || !telefono || !cedula || !id_genero || !id_rol || !id_pregunta_seguridad || !respuesta_seguridad || !contraseña || !gmail) {
    return res.status(400).json({ message: "Por favor, complete todos los campos." });
  }

  try {
    // Llama al modelo para registrar el usuario
    const userId = await createUser(req.body);

    // Responde con un mensaje de éxito y el ID del nuevo usuario
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al registrar el usuario." });
  }
};
