import { z } from "zod";

export const registroSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .refine(val => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val), {
      message: "El nombre no debe contener números ni caracteres especiales",
    }),

  apellido: z
    .string()
    .min(1, "El apellido es obligatorio")
    .refine(val => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val), {
      message: "El apellido no debe contener números ni caracteres especiales",
    }),

  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .refine(val => /^\d+$/.test(val), {
      message: "El teléfono solo debe contener números",
    }),

  cedula: z
    .string()
    .min(1, "La cédula es obligatoria")
    .min(8, "La cédula debe tener al menos  dígitos")
    .refine(val => /^\d+$/.test(val), {
      message: "La cédula solo debe contener números",
    }),

  gmail: z.string().email("Correo no válido"),
  id_genero: z.string().min(1, "Selecciona un género"),
  id_rol: z.string().min(1, "Selecciona un tipo de participante"),
  id_pregunta: z.string().min(1, "Selecciona una pregunta"),
  respuesta: z.string().min(1, "La respuesta es obligatoria"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmarContraseña: z.string().min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
}).refine((data) => data.contraseña === data.confirmarContraseña, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContraseña"],
});
