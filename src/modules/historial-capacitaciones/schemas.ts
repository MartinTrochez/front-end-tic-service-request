import { z } from "zod";

// Schemas específicos del módulo "historial-capacitaciones".
// Están pensados para modelar la respuesta del endpoint de soportes
// y permitir inferir tipos locales reutilizables en UI/Server.

export const instituteSchema = z.object({
  id: z.number().int().positive(),
  cuit: z.string(),
  domain: z.string(),
  enabled: z.boolean(),
  mail: z.string().email(),
  phone: z.string(),
});

export const technicianSchema = z.object({
  dni: z.string().min(8),
  institute: instituteSchema,
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().optional(),
  mail: z.string().email(),
  enabled: z.boolean(),
});

export const supportStateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nonempty(),
});

export const supportTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nonempty(),
});

export const techSupportSchema = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  date: z.date(),
  description: z.string().optional(),
  technician: technicianSchema,
  institute: instituteSchema,
  supportType: supportTypeSchema,
  supportState: supportStateSchema,
});

export const techSupportsArraySchema = z.array(techSupportSchema);

export type Institute = z.infer<typeof instituteSchema>;
export type Technician = z.infer<typeof technicianSchema>;
export type SupportState = z.infer<typeof supportStateSchema>;
export type SupportType = z.infer<typeof supportTypeSchema>;
export type TechSupport = z.infer<typeof techSupportSchema>;
export type TechSupportList = z.infer<typeof techSupportsArraySchema>;
