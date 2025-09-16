import { perfilRouter } from '@/modules/perfil/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    perfil: perfilRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
