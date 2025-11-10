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

type FormValues = z.infer<typeof schema>;

// Mock de encargados
const ENCARGADOS = [
  { id: "marcela", label: "Marcela Gómez" },
  { id: "andres", label: "Andrés Pérez" },
];

const fechasOcupadas = [
  new Date(2025, 10, 1),
  new Date(2025, 10, 25),
  new Date(2025, 10, 9), 
]

export default function NuevaCapacitacionPage() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      fechaPropuesta: undefined,
      encargado: "",
      datosExtra: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: FormValues) {
    try {
      setSubmitting(true);
      // TODO: sustituir por llamada real a la API
      await new Promise((r) => setTimeout(r, 700));
      console.log("Solicitud creada:", values);
      form.reset();
      alert("✅ Solicitud creada con éxito");
    } catch (err) {
      console.error(err);
      alert("❌ Ocurrió un error al crear la solicitud");
    } finally {
      setSubmitting(false);
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

        {/* Formulario */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Datos de la solicitud</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Form {...form}>
              <form
                id="form-nueva-capacitacion"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 md:gap-6"
              >
                {/* Nombre de la solicitud */}
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la solicitud</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Taller de Redes Avanzadas"
                          {...field}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha propuesta */}
                <FormField
                  control={form.control}
                  name="fechaPropuesta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha propuesta</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : (
                                <span>Elegí una fecha</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          disabled={fechasOcupadas}
                          classNames={{
                            day_disabled: "text-gray-400 opacity-50 line-through cursor-not-allowed"
                          }}
                        />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Encargado */}
                <FormField
                  control={form.control}
                  name="encargado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encargado</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Seleccioná un encargado" />
                          </SelectTrigger>
                          <SelectContent>
                            {ENCARGADOS.map((e) => (
                              <SelectItem key={e.id} value={e.id}>
                                {e.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Datos extra */}
                <FormField
                  control={form.control}
                  name="datosExtra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datos extra (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observaciones, requerimientos especiales, notas internas…"
                          rows={4}
                          {...field}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Acciones secundarias */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={submitting}
                    className="text-sm"
                  >
                    Limpiar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#FA6D1C] hover:bg-[#338BE7] rounded-full text-sm px-4"
                    disabled={submitting}
                  >
                    {submitting ? "Creando..." : "Crear solicitud"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
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
