import { Navbar } from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";
import { BackgroundGradient } from "@/components/background-gradient";

interface HomeProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <BackgroundGradient className="flex flex-1 flex-col items-center justify-center">
        {children}
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
