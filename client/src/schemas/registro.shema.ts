// src/schemas/registro.schema.ts
import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  cedula: z.string().min(1, "La cédula es obligatoria"),
  gmail: z.string().email("Correo no válido"),
  id_genero: z.string().min(1, "Selecciona un género"),
  id_rol: z.string().min(1, "Selecciona un tipo de participante"),
  id_pregunta: z.string().min(1, "Selecciona una pregunta"),
  respuesta: z.string().min(1, "La respuesta es obligatoria"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
