"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  cuit: z
    .string()
    .min(1, { error: "El número de cuit es requerido" })
    .regex(/^\d+$/, { error: "El cuit debe contener solo números" }),
  password: z.string().min(1, { error: "Contraseña es requerida" }),
});

export const SignInView = () => {
  const router = useRouter();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuit: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // TODO: Falta implementar sistema de autenticacion
    // setError(null);
    // setPending(true);

    router.push("/");
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <Card className="overflow-hidden p-0 max-w-sm">
        <CardContent className="grid p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Bienvenido al login de Servicios de Capacitaciones
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Ingresa con tu número de cuit y contraseña
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="cuit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuit</FormLabel>
                        <FormControl>
                          <Input
                            className="placeholder:italic"
                            type="cuit"
                            placeholder="Ingresa tu numero de Cuit"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  className="bg-[#FA6D1C] rounded-full hover:bg-[#338BE7] px-3.5 text-lg w-full"
                  disabled={pending}
                  type="submit"
                >
                  Ingresar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
