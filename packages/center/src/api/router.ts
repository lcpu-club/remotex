import { adminRouter } from './admin.js'
import { router } from './trpc.js'
import { userRouter } from './user.js'

export const appRouter = router({
  user: userRouter,
  admin: adminRouter
})
export type AppRouter = typeof appRouter
