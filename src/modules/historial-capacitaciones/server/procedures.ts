import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { BACKEND_URL } from "@/modules/constants";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { directors } from "@/api/schema";
import { techSupports } from "../schemas";

export const historialCapacitacionesRouter = createTRPCRouter({
  listByInstitute: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      // 1) Obtener DNI del usuario autenticado
      const dni = ctx.auth.userId;
      if (!dni) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // 2) Buscar director para obtener el CUIT del instituto
      const directorRes = await fetch(`${BACKEND_URL}/api/directors/${dni}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!directorRes.ok) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Director no encontrado" });
      }

      const director = directors.parse(await directorRes.json());
      const cuit = director.institute.cuit;

      // 3) Llamar al endpoint de supports con el CUIT
      const url = `${BACKEND_URL}/api/support/institute/${encodeURIComponent(cuit)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (response.status === 204) {
        return [] as z.infer<typeof techSupports>;
      }

      if (!response.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Error obteniendo capacitaciones" });
      }

      const json = await response.json();
      const data = techSupports.parse(json);
      return data;
    }),
});
