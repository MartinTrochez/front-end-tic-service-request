import { perfilRouter } from '@/modules/perfil/server/procedures';
import { historialCapacitacionesRouter } from '@/modules/historial-capacitaciones/server/procedures';
import { createTRPCRouter } from '../init';
import { nuevaSolicitudRouter } from '@/modules/nueva-capacitacion/server/procedures';

export const appRouter = createTRPCRouter({
    perfil: perfilRouter,
    nuevaSolicitud: nuevaSolicitudRouter, 
=======
    historialCapacitaciones: historialCapacitacionesRouter,
    nuevaSolicitud: nuevaSolicitudRouter, 
});

// export type definition of API
export type AppRouter = typeof appRouter;
