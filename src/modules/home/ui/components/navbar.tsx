"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import { deleteSession } from "@/lib/session";

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

interface NotificationProps {
  isOpen: boolean
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-muted hover:bg-muted rounded-full hover:border-primary px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Inicio" },
  { href: "/perfil-director", children: "Perfil de Director" },
  { href: "/perfil-referente", children: "Perfil de Referente" },
];

const NotificationCapacitacion = ({isOpen}: NotificationProps) => {
  return (
    <div>
      <p>notificacon</p>
    </div>
  )
}

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSignOut = () => {
    deleteSession();
  };

  const onBellPressed = () => {
    // NOTE: traer un componente que advierta al usuario que tiene capacitaciones finalizadas y sin validar
  }

  return (
    <nav className="px-4 h-20 flex border-b-2 border-b-black justify-between font-medium bg-white">
      <div className="flex items-center">
        <Image src="/logo-3.png" height={60} width={60} alt="TIC" />
      </div>

      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
        {// NOTE: Poner un icono o boton para ver notificaciones
        }
        <Button onClick={onBellPressed}>
          <Bell />
        </Button>

      </div>

      <div className="hidden lg:flex gap-4 items-center pr-3">
        <Button
          asChild
          variant="secondary"
          className="bg-[#FA6D1C] rounded-full hover:bg-[#338BE7] px-3.5 text-lg"
          onClick={handleSignOut}
        >
          <Link href="/sign-in" className="text-white">
            Salir
          </Link>
        </Button>
      </div>

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
