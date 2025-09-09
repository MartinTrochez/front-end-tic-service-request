// TODO: 
// Permitir que el director pueda cambiar
// Cambiar: Nombre, appellido, mail, numero de telefono

import { z } from "zod"

export const directorSchema = z.object({
    dni: z.string(),

// {
//   "dni": "55555555",
//   "institute": {
//     "id": 1,
//     "cuit": "30-12345678-9",
//     "domain": "institute1.edu",
//     "enabled": true,
//     "mail": "info@institute1.edu",
//     "phone": "+54-376-4000001"
//   },
//   "name": "Laura",
//   "lastname": "Fernandez",
//   "phone": "+54-376-6000010",
//   "mail": "laura.fernandez@institute1.edu",
//   "enabled": true
// }
//
}
