import { z } from "zod"

export const signInSchema = z.object({
  cuit: z
    .string()
    .min(11, {
      error: "El número de cuit es requerido y de una longitud 11 como mínimo",
    })
    .regex(/^\d+$/, { error: "El cuit debe contener solo números" }),
  password: z.string().min(1, { error: "Contraseña es requerida" }),
});

export type SignInData = z.infer<typeof signInSchema>
