import { HistorialCapacitacionesView } from "@/modules/historial-solicitudes/ui/views/historial-capacitaciones-view";
import { getSession } from "@/lib/session";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function HistorialCapacitacionesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.historialCapacitaciones.getInstituteSupports.queryOptions(),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistorialCapacitacionesView />
    </HydrationBoundary>
  );
}
