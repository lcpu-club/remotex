import { tRPC } from './trpc.js'
import { uiRouter } from './ui.js'

export const appRouter = tRPC.router({
  ui: uiRouter
})
export type AppRouter = typeof appRouter
