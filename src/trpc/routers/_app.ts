import { perfilRouter } from '@/modules/perfil/server/procedures';
import { historialCapacitacionesRouter } from '@/modules/historial-capacitaciones/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    perfil: perfilRouter,
    historialCapacitaciones: historialCapacitacionesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
