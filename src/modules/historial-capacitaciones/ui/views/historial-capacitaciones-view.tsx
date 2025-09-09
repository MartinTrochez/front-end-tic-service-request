"use client";

import { useState } from "react";
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tipos para las capacitaciones
type EstadoCapacitacion = "aceptada" | "rechazada" | "en-espera";

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  fechaSolicitud: string;
  fechaCapacitacion?: string;
  estado: EstadoCapacitacion;
  referente?: string;
  duracion?: string;
}

// Datos ejemplo
const capacitacionesMock: Capacitacion[] = [
{
  id: "1",
  titulo: "Introducción a la Computación",
  descripcion: "Uso básico de la computadora: encendido, teclado, mouse y programas iniciales",
  fechaSolicitud: "2024-09-06",
  fechaCapacitacion: "2024-09-14",
  estado: "en-espera",
  referente: "Ana Torres",
  duracion: "2 horas"
},
{
  id: "2",
  titulo: "Taller de Computación",
  descripcion: "Manejo intermedio de sistemas operativos y software común",
  fechaSolicitud: "2024-09-07",
  fechaCapacitacion: "2024-09-15",
  estado: "aceptada",
  referente: "Luis Martínez",
  duracion: "2 horas"
},
{
  id: "3",
  titulo: "Uso de Office",
  descripcion: "Conceptos básicos de Word, Excel y PowerPoint",
  fechaSolicitud: "2024-09-08",
  fechaCapacitacion: "2024-09-15",
  estado: "aceptada",
  referente: "Marta Gómez",
  duracion: "4 horas"
},
{
  id: "4",
  titulo: "Mantenimiento Básico de PCs",
  descripcion: "Limpieza física, organización de archivos y cuidados generales del equipo",
  fechaSolicitud: "2024-09-09",
  fechaCapacitacion: "2024-09-21",
  estado: "en-espera",
  referente: "Diego Suárez",
  duracion: "3 horas"
},
{
  id: "5",
  titulo: "Seguridad Informática",
  descripcion: "Buenas prácticas para proteger la información personal y evitar fraudes en línea",
  fechaSolicitud: "2024-09-10",
  estado: "aceptada",
  referente: "Claudia Ramírez",
  duracion: "3 horas"
}
];
export default function FiltrosCard() {
  const [filtroTexto, setFiltroTexto] = useState(""); 
  const [filtroEstado, setFiltroEstado] = useState("todos"); 

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
    </CardHeader>

  <CardContent className="pt-0">
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex-1">
        <Input
          placeholder="Buscar por título o descripción..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filtroEstado === "todos" ? "default" : "outline"}
          onClick={() => setFiltroEstado("todos")}
          size="sm"
          className="whitespace-nowrap"
        >
          Todos
        </Button>

        <Button
          variant={filtroEstado === "aceptada" ? "default" : "outline"}
          onClick={() => setFiltroEstado("aceptada")}
          size="sm"
          className="whitespace-nowrap"
        >
          Aceptadas
        </Button>

        <Button
          variant={filtroEstado === "en-espera" ? "default" : "outline"}
          onClick={() => setFiltroEstado("en-espera")}
          size="sm"
          className="whitespace-nowrap"
        >
          En Espera
        </Button>

        <Button
          variant={filtroEstado === "rechazada" ? "default" : "outline"}
          onClick={() => setFiltroEstado("rechazada")}
          size="sm"
          className="whitespace-nowrap"
        >
          Rechazadas
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
  );
}


const getEstadoConfig = (estado: EstadoCapacitacion) => {
  switch (estado) {
    case "aceptada":
      return {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Aceptada"
      };
    case "rechazada":
      return {
        icon: XCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rechazada"
      };
    case "en-espera":
      return {
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "En Espera"
      };
  }
};

export const HistorialCapacitacionesView = () => {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>(capacitacionesMock);
  const [filtroTexto, setFiltroTexto] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoCapacitacion | "todos">("todos");

  // Filtrar capacitaciones
  const capacitacionesFiltradas = capacitaciones.filter((capacitacion) => {
    const coincideTexto = capacitacion.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                         capacitacion.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || capacitacion.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Historial de Capacitaciones</h1>
          </div>
          <p className="font-medium">
            Aquí puedes ver todas tus solicitudes de capacitación y su estado actual
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título o descripción..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={filtroEstado === "todos" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("todos")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Todos
                </Button>
                <Button
                  variant={filtroEstado === "aceptada" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("aceptada")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Aceptadas
                </Button>
                <Button
                  variant={filtroEstado === "en-espera" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("en-espera")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  En Espera
                </Button>
                <Button
                  variant={filtroEstado === "rechazada" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("rechazada")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Rechazadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Capacitaciones */}
        <div className="grid gap-4">
          {capacitacionesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron capacitaciones</h3>
                <p className="text-muted-foreground text-center">
                  No hay capacitaciones que coincidan con los filtros seleccionados
                </p>
              </CardContent>
            </Card>
          ) : (
            capacitacionesFiltradas.map((capacitacion) => {
              const estadoConfig = getEstadoConfig(capacitacion.estado);
              const IconoEstado = estadoConfig.icon;

              return (
                <Card key={capacitacion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col gap-3 md:gap-4">
                      {/* Header de la card */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg md:text-xl font-semibold leading-tight">{capacitacion.titulo}</h3>
                          <Badge className={`${estadoConfig.color} flex-shrink-0`}>
                            <IconoEstado className="w-3 h-3 mr-1" />
                            {estadoConfig.label}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                          {capacitacion.descripcion}
                        </p>
                      </div>

                      {/* Información en grid más compacto */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">Solicitada</p>
                            <p className="text-muted-foreground text-xs">{capacitacion.fechaSolicitud}</p>
                          </div>
                        </div>

                        {capacitacion.duracion && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Duración</p>
                              <p className="text-muted-foreground text-xs">{capacitacion.duracion}</p>
                            </div>
                          </div>
                        )}

                        {capacitacion.fechaCapacitacion && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Programada</p>
                              <p className="text-muted-foreground text-xs">{capacitacion.fechaCapacitacion}</p>
                            </div>
                          </div>
                        )}

                        {capacitacion.referente && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-muted-foreground rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium">Referente</p>
                              <p className="text-muted-foreground text-xs">{capacitacion.referente}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm">
                          Ver Detalles
                        </Button>
                        {capacitacion.estado === "en-espera" && (
                          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm text-red-600 border-red-200 hover:bg-red-50">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Resumen */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span className="text-lg md:text-2xl font-bold">
                    {capacitaciones.filter(c => c.estado === "aceptada").length}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">Aceptadas</p>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                  <span className="text-lg md:text-2xl font-bold">
                    {capacitaciones.filter(c => c.estado === "en-espera").length}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">En Espera</p>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  <span className="text-lg md:text-2xl font-bold">
                    {capacitaciones.filter(c => c.estado === "rechazada").length}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">Rechazadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};