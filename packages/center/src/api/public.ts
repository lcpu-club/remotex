import { z } from 'zod'
import { publicProcedure, router } from './trpc.js'

export const publicRouter = router({
  verify: publicProcedure
    .input(
      z.object({
        token: z.string(),
        policies: z
          .array(z.string().regex(/^[a-zA-Z0-9:]+$/))
          .min(1)
          .max(50)
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
