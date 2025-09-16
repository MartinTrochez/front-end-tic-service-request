import { HomeView } from "@/modules/home/ui/views/home-view";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session!.userId)

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <HomeView />
  )
}
