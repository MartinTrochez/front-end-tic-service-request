"use client";

import { useState } from "react";
import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  fechaPropuesta: z.date().refine((date) => date instanceof Date, {
    message: "Seleccioná una fecha",
  }),
  encargado: z.string().min(1, "Seleccioná un encargado"),
  datosExtra: z.string().max(1000, "Máximo 1000 caracteres").optional(),
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
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Nueva Solicitud de capacitación</h1>
            <Button
              type="submit"
              form="form-nueva-capacitacion"
              className="bg-[#FA6D1C] hover:bg-[#338BE7] rounded-full text-sm md:text-base px-3 md:px-4"
              disabled={submitting}
            >
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Completá los campos para registrar una nueva solicitud de capacitación.
          </p>
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
    </div>
  );
}
