import { z } from "zod";

export const modalSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").transform((value) => value.trim()),
  descripcion: z.string().min(1, "La descripción es obligatoria").transform((value) => value.trim()),
  type_id: z.number(),
  id_icono: z.number().nullable(),
  orden: z.string()
});