import { PerfilView } from "@/modules/perfil/ui/views/perfil-view"

interface PerfilIdPageProps {
  params: Promise<{ perfilId: string }>
}

export default async function PerfilIdPage({ params }: PerfilIdPageProps) {
  const { perfilId } = await params

  // TODO: Si no esta registrado tiene que volver
  // if !session {
  //   return 
  // }

  // TODO: Implementar la coneccion con la api y la base de datos
  // const queryClient = getQueryClient()
  // void queryClient.prefetchQuery(
  // aca se tiene que usar trpc para hacer la query con la id  
  // )

  return (
    <PerfilView directorDNI={perfilId} /> 
  )
}
