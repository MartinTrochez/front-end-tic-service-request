import { perfilRouter } from '@/modules/perfil/server/procedures';
import { historialCapacitacionesRouter } from '@/modules/historial-solicitudes/server/procedures';
import { createTRPCRouter } from '../init';
import { nuevaSolicitudRouter } from '@/modules/nueva-solicitud/server/procedures';

export const appRouter = createTRPCRouter({
    perfil: perfilRouter,
    nuevaSolicitud: nuevaSolicitudRouter, 
    historialCapacitaciones: historialCapacitacionesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
