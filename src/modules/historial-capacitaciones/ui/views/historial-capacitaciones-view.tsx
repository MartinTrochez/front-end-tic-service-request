"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type EstadoCapacitacion = "Aceptado" | "Finalizado" | "Enviado" | "Rechazado";

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  fechaCapacitacion?: string;
  estado: EstadoCapacitacion;
  referente?: string;
}

interface ConfimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
}

const capacitacionesMock: Capacitacion[] = [
  {
    id: "1",
    titulo: "Introducción a la Computación",
    descripcion:
      "Uso básico de la computadora: encendido, teclado, mouse y programas iniciales",
    fechaCapacitacion: "2024-09-14",
    estado: "Enviado",
    referente: "Ana Torres",
  },
  {
    id: "2",
    titulo: "Taller de Computación",
    descripcion: "Manejo intermedio de sistemas operativos y software común",
    fechaCapacitacion: "2024-09-15",
    estado: "Aceptado",
    referente: "Luis Martínez",
  },
  {
    id: "3",
    titulo: "Uso de Office",
    descripcion: "Conceptos básicos de Word, Excel y PowerPoint",
    fechaCapacitacion: "2024-09-15",
    estado: "Aceptado",
    referente: "Marta Gómez",
  },
  {
    id: "4",
    titulo: "Mantenimiento Básico de PCs",
    descripcion:
      "Limpieza física, organización de archivos y cuidados generales del equipo",
    fechaCapacitacion: "2024-09-21",
    estado: "Enviado",
    referente: "Diego Suárez",
  },
  {
    id: "5",
    titulo: "Seguridad Informática",
    descripcion:
      "Buenas prácticas para proteger la información personal y evitar fraudes en línea",
    fechaCapacitacion: "2024-09-22",
    estado: "Finalizado",
    referente: "Claudia Ramírez",
  },
];

const getEstadoConfig = (estado: EstadoCapacitacion) => {
  switch (estado) {
    case "Rechazado":
      return {
        icon: CheckCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rechazado",
      };
    case "Aceptado":
      return {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Aceptado",
      };
    case "Finalizado":
      return {
        icon: XCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Finalizado",
      };
    case "Enviado":
      return {
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "En Espera",
      };
  }
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  titulo,
}: ConfimationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Confirmar Validación</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            ¿Estás seguro que deseas validar la capacitación "
            <strong>{titulo}</strong>"?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="rounded-full">
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const HistorialCapacitacionesView = () => {
  const [capacitaciones, setCapacitaciones] =
    useState<Capacitacion[]>(capacitacionesMock);
  const [filtroTexto, setFiltroTexto] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<
    EstadoCapacitacion | "todos"
  >("todos");
  const [checkedCards, setCheckedCards] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] =
    useState<Capacitacion | null>(null);

  const capacitacionesFiltradas = capacitaciones.filter((capacitacion) => {
    const coincideTexto =
      capacitacion.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      capacitacion.descripcion
        .toLowerCase()
        .includes(filtroTexto.toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" || capacitacion.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedCards((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleValidarClick = (capacitacion: Capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setModalOpen(true);
  };

  const handleConfirmValidation = () => {
    if (selectedCapacitacion) {
      console.log("Validando capacitación:", selectedCapacitacion.id);

      setCapacitaciones((prev) =>
        prev.map((c) =>
          c.id === selectedCapacitacion.id
            ? { ...c, estado: "Finalizado" as EstadoCapacitacion }
            : c,
        ),
      );

      setCheckedCards((prev) => ({
        ...prev,
        [selectedCapacitacion.id]: false,
      }));
    }

    setModalOpen(false);
    setSelectedCapacitacion(null);
  };

  const isValidarDisabled = (capacitacion: Capacitacion) => {
    return (
      (capacitacion.estado === "Aceptado" ||
        capacitacion.estado === "Finalizado") &&
      !checkedCards[capacitacion.id]
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex flex-col gap-4 md:gap-6">

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Historial de Capacitaciones
                </h1>
              </div>
              <p className="font-medium">
                Aquí puedes ver todas tus solicitudes de capacitación y su
                estado actual
              </p>
            </div>

            <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-2 md:gap-4">
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
                  variant={filtroEstado === "Aceptado" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("Aceptado")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Aceptados
                </Button>
                <Button
                  variant={filtroEstado === "Enviado" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("Enviado")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Enviado
                </Button>
                <Button
                  variant={filtroEstado === "Enviado" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("Enviado")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Rechazado
                </Button>
                <Button
                  variant={
                    filtroEstado === "Finalizado" ? "default" : "outline"
                  }
                  onClick={() => setFiltroEstado("Finalizado")}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Finalizados
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
                <h3 className="text-lg font-semibold mb-2">
                  No se encontraron capacitaciones
                </h3>
                <p className="text-muted-foreground text-center">
                  No hay capacitaciones que coincidan con los filtros
                  seleccionados
                </p>
              </CardContent>
            </Card>
          ) : (
            capacitacionesFiltradas.map((capacitacion) => {
              const estadoConfig = getEstadoConfig(capacitacion.estado);
              const IconoEstado = estadoConfig.icon;

              return (
                <Card
                  key={capacitacion.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col gap-3 md:gap-4">
                      {/* Header de la card */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg md:text-xl font-semibold leading-tight">
                            {capacitacion.titulo}
                          </h3>
                          <Badge
                            className={`${estadoConfig.color} flex-shrink-0`}
                          >
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
                        {capacitacion.fechaCapacitacion && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">Programada</p>
                              <p className="text-muted-foreground text-xs">
                                {capacitacion.fechaCapacitacion}
                              </p>
                            </div>
                          </div>
                        )}

                        {capacitacion.referente && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-muted-foreground rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium">Referente</p>
                              <p className="text-muted-foreground text-xs">
                                {capacitacion.referente}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Checkbox for Aceptado state */}
                      {capacitacion.estado === "Aceptado" && (
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          <Checkbox
                            id={`checkbox-${capacitacion.id}`}
                            checked={checkedCards[capacitacion.id] || false}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                capacitacion.id,
                                checked as boolean,
                              )
                            }
                          />
                          <label
                            htmlFor={`checkbox-${capacitacion.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Confirmo que he completado esta capacitación
                          </label>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex flex-col space-y-3">
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="rounded-full flex-1"
                          >
                            Ver Detalles
                          </Button>
                        </div>

                        <Button
                          className="bg-[#FA6D1C] rounded-full hover:bg-[#338BE7] px-3.5 text-lg w-full"
                          type="submit"
                          disabled={isValidarDisabled(capacitacion)}
                          onClick={() => handleValidarClick(capacitacion)}
                        >
                          Validar
                        </Button>
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
                    {
                      capacitaciones.filter((c) => c.estado === "Aceptado")
                        .length
                    }
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Aceptados
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                  <span className="text-lg md:text-2xl font-bold">
                    {
                      capacitaciones.filter((c) => c.estado === "Enviado")
                        .length
                    }
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">
                  En Espera
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  <span className="text-lg md:text-2xl font-bold">
                    {
                      capacitaciones.filter((c) => c.estado === "Finalizado")
                        .length
                    }
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Finalizados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmValidation}
        titulo={selectedCapacitacion?.titulo || ""}
      />
    </div>
  );
};
