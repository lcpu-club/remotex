import { z } from 'zod'
import { publicProcedure, router } from './trpc.js'

export const publicRouter = router({
  verify: publicProcedure
    .input(
      z.object({
        token: z.string(),
        policies: z.array(z.string()).min(1).max(5)
      })
    )
    .query(async ({ ctx, input }) => {
      const info = ctx.dbconn.token.loadUserInfo(
        input.token,
        <never>input.policies
      )
      return info
    })
})
