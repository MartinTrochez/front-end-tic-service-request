import { z } from "zod";
import { institutes } from "@/api/schema";

export const technician = z.object({
  id: z.number().int(),
  dni: z.string(),
  enabled: z.boolean(),
  lastname: z.string(),
  mail: z.string(),
  name: z.string(),
  phone: z.string(),
  institute: institutes,
});

export const techSupport = z.object({
  code: z.string(),
  institute: institutes,
  date: z.string(),
  supportType: z.string(),
  supportState: z.string(),
  technician: technician,
  description: z.string(),
});

export const techSupports = z.array(techSupport);

export type TechSupport = z.infer<typeof techSupport>;
export type TechSupports = z.infer<typeof techSupports>;
