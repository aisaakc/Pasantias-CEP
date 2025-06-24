import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().refine((value) => {
        // Si contiene @, debe ser un email válido
        if (value.includes('@')) {
            return z.string().email().safeParse(value).success;
        }
        // Si no contiene @, debe ser una cédula de al menos 8 dígitos
        return /^\d{4,}$/.test(value);
    }, {
        message: "Debe ser un correo electrónico válido o una cédula de al menos 4 dígitos numéricos"
    }),
    
});

