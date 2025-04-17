import UserModel from "../models/persona.js";

export const obtenerGeneros = async (req, res) => {
  try {
    const generos = await UserModel.getGeneros();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};3

export const obtenerRoles = async (req, res) => {
  try {
    const roles = await UserModel.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await UserModel.getPreguntasSeguridad();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarUsuario = async (req, res) => {
  try {
    const userId = await UserModel.createUser(req.body);
    res.status(201).json({ message: "Usuario registrado", userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export const loginUsuario = async (req, res) => {
  const { gmail, contraseña } = req.body;

  try {
    if (!gmail || !contraseña) {
      return res.status(400).json({ error: "Debe proporcionar el correo y la contraseña." });
    }

    const usuario = await UserModel.loginUser({ gmail, contraseña });

    const { id, nombre, apellido, gmail: userGmail, id_rol } = usuario;

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: { id, nombre, apellido, gmail: userGmail, id_rol },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};




