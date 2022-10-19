import { initTRPC } from '@trpc/server'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export async function createContext(opts: CreateFastifyContextOptions) {
  const server = opts.res.server
  return {
    req: opts.req,
    res: opts.res,
    dbconn: server.dbconn,
    db: server.db
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const tRPC = initTRPC.context<Context>().create()
