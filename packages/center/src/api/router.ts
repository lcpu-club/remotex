import { adminRouter } from './admin.js'
import { tRPC } from './trpc.js'
import { userRouter } from './user.js'

export const appRouter = tRPC.router({
  user: userRouter,
  admin: adminRouter
})
export type AppRouter = typeof appRouter
