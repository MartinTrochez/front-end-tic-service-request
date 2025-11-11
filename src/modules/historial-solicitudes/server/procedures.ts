import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { BACKEND_URL, } from "@/modules/constants";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { directors, techSupports } from "@/api/schema";

export const historialCapacitacionesRouter = createTRPCRouter({
  // Lista soportes/visitas del instituto al que pertenece el director logueado
  getInstituteSupports: protectedProcedure
    .input(z.void())
    .query(async ({ ctx }) => {
      const dni = ctx.auth.userId;

      // 1) Buscar director para obtener el CUIT del instituto
      const directorResp = await fetch(`${BACKEND_URL}/api/directors/${dni}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!directorResp.ok) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Director no encontrado" });
      }

      const director = directors.parse(await directorResp.json());
      const cuit = director.institute.cuit;

      // 2) Obtener historiales por CUIT
        // 2) Obtener historiales por CUIT (permite override por env en runtime)
        
        const url = `${BACKEND_URL}/api/support/institute/${encodeURIComponent(cuit)}`;
        console.log("[historial] BACKEND_URL:", BACKEND_URL);
    
        console.log("[historial] cuit:", cuit);
        console.log("[historial] URL final:", url);
      console.log("URL que se va a llamar:", url);
      const supportsResp = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (supportsResp.status === 204) {
        return [] as z.infer<typeof techSupports>[];
      }

      if (!supportsResp.ok) {
        const errorText = await supportsResp.text().catch(() => "");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error al obtener el historial de visitas (status ${supportsResp.status}). Endpoint: ${url}. ${errorText?.slice(0, 200)}`,
        });
      }

  const raw = await supportsResp.json();

      // 3) Normalizar y lubricar la respuesta del backend antes de validar con Zod.
      // Algunos backends devuelven nulls, strings en lugar de objetos o usan "code" en vez de "id".
      // Aquí convertimos esos casos a formas que cumplen el schema esperado por `techSupports`.
      const normalized = (raw as unknown[]).map((s: any, idx: number) => {
        const emailIsValid = (val: unknown) => {
          if (typeof val !== "string") return false;
          try {
            return z.string().email().safeParse(val).success;
          } catch {
            return false;
          }
        };
        const validEmailOr = (val: unknown, fallback = "user@example.com") =>
          emailIsValid(val) ? (val as string) : fallback;
        // id: intentar mantener un número válido, fallback al índice
        const rawId = s?.id ?? s?.code;
        const id = typeof rawId === "number" && Number.isFinite(rawId) && rawId > 0
          ? rawId
          : idx + 1;

        // code: siempre string
        const code = String(s?.code ?? s?.id ?? id);

        // date: convertir strings a Date, fallback a now
        const date = s?.date ? new Date(s.date) : new Date();

        // description: zod optional no acepta null, así que convertimos null -> undefined
        const description = s?.description === null ? undefined : s?.description;

        // technician: si viene como objeto, usarlo; si viene null/undefined, crear un objeto mínimo válido
        const rawTech = s?.technician ?? {};
        const technician = {
          dni: String(rawTech?.dni ?? ""),
          institute: typeof rawTech?.institute === "object" && rawTech?.institute !== null
            ? rawTech.institute
            : (typeof s?.institute === "object" && s?.institute !== null ? s.institute : {
                id: 1,
                cuit: String(s?.institute?.cuit ?? ""),
                domain: String(s?.institute?.domain ?? ""),
                enabled: !!s?.institute?.enabled,
                mail: validEmailOr(s?.institute?.mail),
                phone: String(s?.institute?.phone ?? ""),
              }),
          name: String(rawTech?.name ?? ""),
          lastname: String(rawTech?.lastname ?? ""),
          phone: String(rawTech?.phone ?? ""),
          // si mail es inválido o ausente, ponemos un placeholder válido
          mail: validEmailOr(rawTech?.mail),
          enabled: !!rawTech?.enabled,
        };

        // institute: aseguramos objeto válido
        const instituteObj = ((): any => {
          const base = typeof s?.institute === "object" && s?.institute !== null ? s.institute : {};
          const idValue = Number(base?.id);
          return {
            id: Number.isFinite(idValue) && idValue > 0 ? idValue : 1,
            cuit: String(base?.cuit ?? ""),
            domain: String(base?.domain ?? ""),
            enabled: !!base?.enabled,
            mail: validEmailOr(base?.mail),
            phone: String(base?.phone ?? ""),
          };
        })();
        const institute = instituteObj;

        // supportType/supportState: algunos endpoints devuelven directamente el nombre en lugar del objeto
        const supportType = ((): any => {
          if (typeof s?.supportType === "object" && s?.supportType !== null) {
            const idVal = Number(s.supportType.id);
            return {
              id: Number.isFinite(idVal) && idVal > 0 ? idVal : 1,
              name: String(s.supportType.name ?? "Visita"),
            };
          }
          return { id: 1, name: String(s?.supportType ?? "Visita") };
        })();

        const supportState = ((): any => {
          if (typeof s?.supportState === "object" && s?.supportState !== null) {
            const idVal = Number(s.supportState.id);
            return {
              id: Number.isFinite(idVal) && idVal > 0 ? idVal : 1,
              name: String(s.supportState.name ?? "Enviado"),
            };
          }
          return { id: 1, name: String(s?.supportState ?? "Enviado") };
        })();

        return {
          ...s,
          id,
          code,
          date,
          description,
          technician,
          institute,
          supportType,
          supportState,
        } as any;
      });

      return z.array(techSupports).parse(normalized);
    }),
});
