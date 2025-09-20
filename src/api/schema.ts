import { z } from "zod"

export const institutes = z.object({
    id: z.number().int().positive(),
    cuit: z
        .string(),
    domain: z
        .string(),
    enabled: z.boolean(),
    mail: z.email(),
    phone: z
        .string(),
})

export const directors = z.object({
    dni: z
        .string()
        .min(8, {
            error: "El número de cuit es requerido y de una longitud 8 como mínimo",
        }),
    institute: institutes,
    name: z
        .string()
        .min(1, { error: "Nombre es requerido" }),
    lastname: z
        .string()
        .min(1, { error: "Apellido es requerido" }),
    phone: z
        .string(),
    mail: z.email(),
    enabled: z.boolean(),
})
