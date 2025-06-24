import { z } from "zod";

// Tipo para los prefijos telefónicos
interface PrefijoTelefonico {
  id: number;
  nombre: string;
  descripcion?: string;
  adicional?: any;
}

// Función para crear el esquema de registro con prefijos dinámicos
export const createRegistroSchema = (prefijosTelefonicos: PrefijoTelefonico[] = []) => {
  // Extraer los códigos de prefijos de la BD
  const validPrefixes = prefijosTelefonicos.map(prefijo => prefijo.nombre);

  return z.object({
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
      .refine(val => /^\d{11}$/.test(val), {
        message: "El teléfono debe tener exactamente 11 dígitos (4 prefijo + 7 número)",
      })
      .refine(val => {
        // Validar que el prefijo esté en la lista dinámica de la BD
        const prefix = val.substring(0, 4);
        return validPrefixes.includes(prefix);
      }, {
        message: "El prefijo telefónico no es válido. Seleccione un prefijo de la lista.",
      }),

    cedula: z
      .string()
      .min(1, "La cédula es obligatoria")
      .min(4, "La cédula debe tener al menos 4 dígitos")
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
};

// Esquema por defecto para compatibilidad (sin validación de prefijos)
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
    .refine(val => /^\d{11}$/.test(val), {
      message: "El teléfono debe tener exactamente 11 dígitos (4 prefijo + 7 número)",
    }),

  cedula: z
    .string()
    .min(1, "La cédula es obligatoria")
    .min(4, "La cédula debe tener al menos 4 dígitos")
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
