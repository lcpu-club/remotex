import { tRPC } from './trpc.js'

export const uiRouter = tRPC.router({
  config: tRPC.procedure.query(() => {
    return {
      //
    }
  })
})
