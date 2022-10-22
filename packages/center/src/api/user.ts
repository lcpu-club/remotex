import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from './trpc.js'

export const userRouter = router({
  group: protectedProcedure.query(async ({ ctx }) => {
    return ctx.dbconn.group.get({ _id: ctx.user.group._id })
  }),
  tokens: protectedProcedure.query(async ({ ctx }) => {
    return ctx.dbconn.token.list({ userId: ctx.user._id })
  }),
  createToken: protectedProcedure
    .input(
      z.object({
        type: z.enum(['app']),
        prefixes: z.array(z.string()).min(1).max(5),
        expiresAt: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const value = await ctx.dbconn.token.create({
        userId: ctx.user._id,
        ...input
      })
      return value
    }),
  attribute: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.any()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { key, value } = input
      const info = ctx.app.contributions.userAttributes.get(key)
      if (!info || !info.allowUserEdit)
        throw new TRPCError({ code: 'BAD_REQUEST' })
      const parsed = info.schema.parse(value)
      await ctx.dbconn.user.collection.updateOne(
        { _id: ctx.user._id },
        {
          $set: { [`attributes.${key}`]: parsed }
        }
      )
    })
})
