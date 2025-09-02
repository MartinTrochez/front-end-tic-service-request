import { BackgroundGradient } from "@/components/background-gradient";

interface AuthLayoutProps {
  children: React.ReactNode,
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <BackgroundGradient>
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p10">
        <div className="w-full max-w-sm md:max-w-3xl">
          {children}
        </div>
      </div>
    </BackgroundGradient>
  )
}
