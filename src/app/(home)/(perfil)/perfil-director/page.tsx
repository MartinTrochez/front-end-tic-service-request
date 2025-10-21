import { getSession } from "@/lib/session";
import {
  PerfilViewError,
  PerfilViewLoading,
  PerfilDirectorView,
} from "@/modules/perfil/ui/views/perfil-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function PerfilIdPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.perfil.getDirector.queryOptions(),
  );

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<PerfilViewLoading />}>
          <ErrorBoundary fallback={<PerfilViewError />}>
            <PerfilDirectorView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
