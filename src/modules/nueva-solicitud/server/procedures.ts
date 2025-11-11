// modules/nueva-capacitacion/server/procedures.ts
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { BACKEND_URL } from "@/modules/constants";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { directors } from "@/api/schema";

const supportType = z.object({ name: z.string() });
export type SupportType = z.infer<typeof supportType>;

const instituteSchema = directors.shape.institute;

export const createSolicitudInput = z.object({
  code: z.string().min(1),
  institute: instituteSchema,
  date: z.string().min(1),
  supportType: z.string().min(1),
  supportState: z.string().min(1),
  technician: z.object({
    id: z.number(),             // <-- SOLO id
  }),
  description: z.string().optional(),
});

export type CreateSolicitudInput = z.infer<typeof createSolicitudInput>;

export const nuevaSolicitudRouter = createTRPCRouter({
  getAllSupportType: protectedProcedure
    .input(z.void())
    .query(async () => {
      const response = await fetch(
        `${BACKEND_URL}/api/support-types/all-types`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tipos de soporte no encontrados",
        });
      }

      const supportTypes = z.array(supportType).parse(await response.json());
      return supportTypes;
    }),

  createSolicitud: protectedProcedure
    .input(createSolicitudInput)
    .mutation(async ({ input }) => {
      const res = await fetch(`${BACKEND_URL}/api/support/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new TRPCError({
          code: res.status === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
          message: text || `Error HTTP ${res.status}`,
        });
      }

      return await res.json().catch(() => ({}));
    }),
});
