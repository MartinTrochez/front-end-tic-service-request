"use client";

import { User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { directors } from "@/api/schema";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// NOTE:Ver para modificar con inputs

const formSchema = z.object({
  dni: z.string().min(8, {
    error: "El número de cuit es requerido y de una longitud 8 como mínimo",
  }),
  instituteDomain: z.string(),
  name: z.string().min(1, { error: "Nombre es requerido" }),
  lastname: z.string().min(1, { error: "Apellido es requerido" }),
  mail: z.email().min(1, { error: "Email es requerido" }),
  phone: z
    .string()
    .min(10, { error: "El telefono tiene que tener 10 dígitos como mínimo" }),
});

export const PerfilView = () => {
  const router = useRouter()
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(trpc.perfil.getDirector.queryOptions());
  const director = directors.parse(data);

  const updateDirector = useMutation<
    z.infer<typeof directors>,
    Error,
    z.infer<typeof directors>
  >(
    trpc.perfil.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.perfil.getDirector.queryOptions(),
        );

        toast.success("¡Datos actualizados correctamente!", {
          description: "Los cambios se guardaron con éxito",
          duration: 3000,
          style: {
            fontSize: "1.25rem",
            textAlign: "center",
            padding: "1rem 2rem",
          },
          position: "top-center",
        });
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: director.name,
      lastname: director.lastname,
      dni: director.dni,
      phone: director.phone,
      mail: director.mail,
      instituteDomain: director.institute.domain,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateDirector.mutate({
      dni: director.dni,
      name: values.name,
      lastname: values.lastname,
      phone: values.phone,
      mail: values.mail,
      enabled: director.enabled,
      institute: {
        ...director.institute,
        domain: values.instituteDomain,
      },
    })

    router.refresh()
  }

  // TODO: Agregar telefono, email y permitir cambios
  return (
    <div className="flex flex-col items-center">
      <Card className="overflow-hidden p-0 max-w-sm">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-xl font-bold">Datos</h1>
        </div>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2 pb-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">Nombre:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                name="lastname"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">Apellido:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                name="dni"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">DNI:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">Teléfono:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                name="mail"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">Email:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                name="instituteDomain"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-2">
                    <FormLabel className="text-right">Instituto:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button
                  className="bg-[#FA6D1C] rounded-full hover:bg-[#338BE7] px-3.5 text-lg w-full"
                  type="submit"
                  disabled={!form.formState.isDirty || updateDirector.isPending}
                >
                  {updateDirector.isPending
                    ? "Actualizando..."
                    : "Actualizar Datos"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export const PerfilViewLoading = () => {
  return (
    <LoadingState
      title="Cargando datos tu perfil"
      description="Esto puede tardar unos segundos"
    />
  );
};

export const PerfilViewError = () => {
  return (
    <ErrorState
      title="Error cargando los datos de tu perfil"
      description="Algo salio mal"
    />
  );
};
