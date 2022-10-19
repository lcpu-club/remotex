import Fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastifyCors from '@fastify/cors'
import { DbConn } from './db/index.js'
import { Router } from '@trpc/server'
import { createContext } from './api/trpc.js'
import { CONFIG } from './config.js'

declare module 'fastify' {
  export interface FastifyInstance {
    dbconn: DbConn
    db: DbConn['db']
  }
}

export async function setupServer(options: { dbconn: DbConn }) {
  const fastify = Fastify({
    logger: true
  })
  fastify.register(fastifyCors, CONFIG.server.cors)
  fastify.decorate('dbconn', options.dbconn)
  fastify.decorate('db', options.dbconn.db)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mount(prefix: string, router: Router<any>) {
    fastify.register(fastifyTRPCPlugin, {
      prefix,
      trpcOptions: {
        router,
        createContext,
        batching: {
          enabled: false
        }
      }
    })
  }
  return { fastify, mount }
}

export type Server = Awaited<ReturnType<typeof setupServer>>
