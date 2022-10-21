import { initTRPC, TRPCError } from '@trpc/server'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { IToken } from '../db/token.js'
import type { IGroupPolicies } from '../mergeables.js'
import { RemoveNull } from '../util/index.js'

export async function createContext(opts: CreateFastifyContextOptions) {
  const server = opts.res.server
  return {
    req: opts.req,
    res: opts.res,
    app: server.app,
    dbconn: server.app.dbconn,
    token: null as IToken | null
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export type Meta = {
  policies: (keyof IGroupPolicies)[]
}

export const tRPC = initTRPC.context<Context>().meta<Meta>().create()

export const requireLogin = tRPC.middleware(async ({ ctx, next }) => {
  const tokenId = ctx.req.headers['x-auth-token']
  if (typeof tokenId !== 'string') throw new TRPCError({ code: 'UNAUTHORIZED' })
  const token = await ctx.app.dbconn.token.get(tokenId)
  if (!token) throw new TRPCError({ code: 'UNAUTHORIZED' })
  ctx.token = token
  return next({
    ctx: ctx as RemoveNull<typeof ctx, 'token'>
  })
})

export const requireScope = tRPC.middleware(async ({ ctx, next }) => {
  if (ctx.token?.subject !== 'center')
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next()
})

export const publicProcedure = tRPC.procedure

export const protectedProcedure = tRPC.procedure
  .use(requireLogin)
  .use(requireScope)

export const requireAdmin = tRPC.middleware(async ({ ctx, next }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = ctx.token!.userId
  const policies = await ctx.app.dbconn.user.getPolicies(userId, [
    'center:admin'
  ])
  if (!policies['center:admin']) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next()
})

export const adminProcedure = protectedProcedure.use(requireAdmin)
