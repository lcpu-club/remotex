import { adminRouter } from './admin.js'
import { publicRouter } from './public.js'
import { router } from './trpc.js'
import { userRouter } from './user.js'

export const appRouter = router({
  public: publicRouter,
  user: userRouter,
  admin: adminRouter
})
export type AppRouter = typeof appRouter
