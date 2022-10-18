import { initTRPC } from '@trpc/server'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export async function createContext(opts: CreateFastifyContextOptions) {
  return {}
}

export type Context = inferAsyncReturnType<typeof createContext>

export const tRPC = initTRPC.context<Context>().create()
