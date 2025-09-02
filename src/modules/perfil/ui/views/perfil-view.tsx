import { User } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface UserInfo {
  nombre: string;
  apellido: string;
  dni: string;
  instituto: string;
}

interface PerfilIdViewProps {
  perfilId: string;
}

// NOTE:Ver para modificar con inputs

export const PerfilView = ({ perfilId }: PerfilIdViewProps) => {
  const userInfo: UserInfo = {
    nombre: "María",
    apellido: "González",
    dni: "12345678",
    instituto: "Instituto Tecnológico Nacional",
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="overflow-hidden p-0 max-w-sm">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-xl font-bold">Datos</h1>
        </div>
        <CardContent>
          <div className="divide-y space-y-2 pb-4">
            <div className="pb-2">
              <Label>
                Nombre: <span className="font-normal">{userInfo.nombre}</span>{" "}
              </Label>
            </div>
            <div className="pt-2 pb-2">
              <Label>
                Apellido: <span className="font-normal">{userInfo.apellido}</span>{" "}
              </Label>
            </div>
            <div className="pt-2 pb-2">
              <Label>
                DNI: <span className="font-normal">{userInfo.dni}</span>{" "}
              </Label>
            </div>
            <div className="pt-2">
              <Label>
                Instituto: <span className="font-normal">{userInfo.instituto}</span>{" "}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
