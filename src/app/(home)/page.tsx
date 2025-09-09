import { HomeView } from "@/modules/home/ui/views/home-view";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <HomeView />
  )
}
