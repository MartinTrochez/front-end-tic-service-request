// modules/nueva-capacitacion/view.tsx
"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";
import type {
  SupportType,
  CreateSolicitudInput,
} from "@/modules/nueva-capacitacion/server/procedures";
import { directors } from "@/api/schema";
import { toast } from "sonner";

const formSchema = z.object({
  supportType: z.string().min(1, { message: "Elegí un tipo" }),
  date: z.string().min(1, { message: "Elegí una fecha" }),
  description: z.string().optional(),
});

const INITIAL_SUPPORT_STATE = "Enviado";
const TECHNICIAN_ID = 1; // id real del técnico en la tabla

export default function NuevaCapSimple() {
  const [supportType, setSupportType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const trpc = useTRPC();

  // director logueado
  const { data: directorData } = useSuspenseQuery(
    trpc.perfil.getDirector.queryOptions(),
  );
  const director = directors.parse(directorData);

  // tipos de capacitación
  const { data: supportTypes } = useSuspenseQuery<SupportType[]>(
    trpc.nuevaSolicitud.getAllSupportType.queryOptions(),
  );

  const createSolicitud = useMutation<unknown, Error, CreateSolicitudInput>(
    trpc.nuevaSolicitud.createSolicitud.mutationOptions({
      onSuccess: () => {
        setMsg("Solicitud creada correctamente.");
        setSupportType("");
        setDate("");
        setDescription("");

        toast.success("Solicitud creada", {
          description: "La solicitud se guardó correctamente.",
          duration: 3000,
        });
      },
      onError: (error: Error) => {
        setMsg(error.message || "Error al crear la solicitud.");
        toast.error("Error al crear la solicitud", {
          description: error.message || "Revisá los datos e intentá nuevamente.",
          duration: 3000,
        });
      },
    }),
  );

  // hoy y mañana (para validar fecha > hoy)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const parsed = formSchema.safeParse({ supportType, date, description });
    if (!parsed.success) {
      setMsg(parsed.error.issues.map((i) => i.message).join(" · "));
      return;
    }

    // no permitir hoy ni fechas anteriores
    if (date <= todayStr) {
      setMsg("La fecha debe ser posterior a hoy.");
      return;
    }

    const code = `REQ-${new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, "")}`;

    const payload: CreateSolicitudInput = {
      code,
      institute: director.institute,
      date: `${date}T00:00:00`,
      supportType,
      supportState: INITIAL_SUPPORT_STATE,
      technician: {
        id: TECHNICIAN_ID,
      },
      description: description || "Solicitud creada desde el portal web",
    };

    console.log("Payload enviado:", payload);
    createSolicitud.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 space-y-3">
      {/* Encargado (bloqueado visualmente) */}
      <div>
        <label className="block text-sm">Encargado</label>
        <div className="px-2 py-1 border rounded bg-gray-300 text-gray-800 cursor-not-allowed">
          Carlos Gonzalez
        </div>
      </div>

      <div>
        <label className="block text-sm">Email del encargado</label>
        <div className="px-2 py-1 border rounded bg-gray-300 text-gray-800 cursor-not-allowed">
          carlos@gmail.com
        </div>
      </div>

      {/* Tipo de capacitación */}
      <div>
        <label className="block text-sm">Tipo de capacitación</label>
        <select
          value={supportType}
          onChange={(e) => setSupportType(e.target.value)}
          className="w-full px-2 py-1 border rounded bg-white"
        >
          <option value="">-- Seleccioná --</option>
          {supportTypes.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha propuesta */}
      <div>
        <label className="block text-sm">Fecha propuesta</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-2 py-1 border rounded bg-white"
          min={minDateStr}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-2 py-1 border rounded bg-white"
          placeholder="Breve detalle de la solicitud..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#FA6D1C] text-white rounded"
          disabled={createSolicitud.isPending}
        >
          {createSolicitud.isPending ? "Creando..." : "Crear solicitud"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSupportType("");
            setDate("");
            setDescription("");
            setMsg("");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Limpiar
        </button>
      </div>

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  );
}
