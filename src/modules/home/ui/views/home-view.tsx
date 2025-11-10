"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface HomeViewProps {
  href: string;
  children: React.ReactNode;
}

const HomeItem = ({ href, children }: HomeViewProps) => {
  return (
    <Button asChild variant="secondary" className="px-3.5 text-lg rounded-full">
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const homeItems = [
  { href: "/nueva-capacitacion", children: "Solicitar una visita" },
  { href: "/historial-capacitaciones", children: "Historial de visitas" },
];

export const HomeView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-20">
      {homeItems.map((item) => (
        <HomeItem key={item.href} href={item.href}>
          {item.children}
        </HomeItem>
      ))}
    </div>
  );
};
