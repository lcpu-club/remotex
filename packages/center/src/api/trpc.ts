import { initTRPC, TRPCError } from '@trpc/server'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { IToken } from '../db/token.js'
import { UserInfo } from '../db/user.js'
import type { IGroupPolicies } from '../contribution/index.js'

export async function createContext(opts: CreateFastifyContextOptions) {
  const server = opts.res.server
  return {
    req: opts.req,
    res: opts.res,
    app: server.app,
    dbconn: server.app.dbconn,
    token: null as never as IToken,
    user: null as never as UserInfo<'center:access' | 'center:admin'>
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export type Meta = {
  policies: (keyof IGroupPolicies)[]
}

export const tRPC = initTRPC.context<Context>().meta<Meta>().create()

export const router = tRPC.router
export const middleware = tRPC.middleware

async function loadTokenFromReq(ctx: Context) {
  const value = ctx.req.headers['x-auth-token']
  if (typeof value !== 'string') throw new TRPCError({ code: 'UNAUTHORIZED' })
  const token = await ctx.app.dbconn.token.get({ value })
  if (!token) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return token
}

export const loadUserInfo = middleware(async ({ ctx, next }) => {
  ctx.token = await loadTokenFromReq(ctx)
  ctx.user = await ctx.dbconn.user.loadUserInfo(ctx.token, [
    'center:access',
    'center:admin'
  ])
  return next()
})

export const requireAccess = middleware(async ({ ctx, next }) => {
  if (!ctx.user.group.policies['center:access']) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next()
})

export const requireAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user.group.policies['center:admin']) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next()
})

export const publicProcedure = tRPC.procedure

const loginLoaded = tRPC.procedure.use(loadUserInfo)
export const protectedProcedure = loginLoaded.use(requireAccess)
export const adminProcedure = loginLoaded.use(requireAdmin)
