import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { directors } from "@/api/schema"

import { directorUpdateSchema } from "../schemas"
import { BACKEND_URL } from "@/modules/constants";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const perfilRouter = createTRPCRouter({
  update: protectedProcedure
    .input(directorUpdateSchema)
    .mutation(async ({ input, ctx }) => {

      const response = await fetch(`${BACKEND_URL}/api/directors/${input.dni}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error al actualizar los datos de perfil`,
        })
      }

      const director = directorUpdateSchema.parse(await response.json())

      return director
    }),

  getDirector: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      const dni = ctx.auth.userId

      const response = await fetch(`${BACKEND_URL}/api/directors/${dni}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Director no encontrado" })
      }

      const director = directors.parse(await response.json())

      if (director.dni !== dni) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Director no encontrado" })
      }

      console.log(director)

      return director
    }),
})
