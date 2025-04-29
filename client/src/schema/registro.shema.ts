import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  cedula: z.string().min(1, "La cédula es obligatoria"),
  gmail: z.string().email("Correo electrónico inválido"),
  id_genero: z.string().min(1, "Selecciona un género"),
  id_rol: z.string().min(1, "Selecciona un rol"),
  id_pregunta: z.string().min(1, "Selecciona una pregunta de seguridad"),
  respuesta: z.string().min(1, "La respuesta secreta es obligatoria"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegistroSchemaType = z.infer<typeof registroSchema>;
