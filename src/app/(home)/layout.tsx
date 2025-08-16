import { Navbar } from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";

interface HomeProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#338BE7]">{children}</div>
      <Footer />
    </div>
  );
}
