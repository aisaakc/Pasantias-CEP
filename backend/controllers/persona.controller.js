import UserModel from '../models/persona.js';

class UserController {
  // ... existing code ...

  async getUsuarios(req, res) {
    try {
      const usuarios = await UserModel.getUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  // ... existing code ...
}

export default new UserController(); 