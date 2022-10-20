import { adminRouter } from './admin.js'
import { tRPC } from './trpc.js'
import { uiRouter } from './ui.js'

export const appRouter = tRPC.router({
  ui: uiRouter,
  admin: adminRouter
})
export type AppRouter = typeof appRouter
