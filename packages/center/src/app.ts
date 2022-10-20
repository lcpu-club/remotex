import fastify from 'fastify'
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod'
import pino from 'pino'
import { DbConn, IDbConnOptions } from './db/index.js'
import { HookManager } from './hook/index.js'
import { IPluginManagerOptions, PluginManager } from './plugin/index.js'
import { Initable } from './util/index.js'
import { Router } from '@trpc/server'
import { createContext } from './api/trpc.js'
import { appRouter } from './api/router.js'

declare module './mergeables.js' {
  interface IHookMap {
    'post-dbconn-setup': [DbConn]
    'post-plugin-setup': [PluginManager]
    'post-server-setup': [App]
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    app: App
  }
}

export interface IAppOptions {
  db: IDbConnOptions
  plugins: IPluginManagerOptions
  cors: FastifyCorsOptions
  host: string
  port: number
}

export class App extends Initable {
  hooks
  dbconn
  plugins
  server

  constructor(public options: IAppOptions) {
    const logger = pino()
    super(logger)
    this.hooks = new HookManager({ logger })
    this.dbconn = new DbConn({ logger }, options.db)
    this.plugins = new PluginManager(
      { logger, hooks: this.hooks },
      options.plugins
    )
    const server = fastify({ logger })
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)
    this.server = server.withTypeProvider<ZodTypeProvider>()
    this.server.decorate('app', this as App)
  }

  async init() {
    await this.dbconn.init()
    this.hooks.fire('post-dbconn-setup', this.dbconn)
    await this.plugins.init()
    this.hooks.fire('post-plugin-setup', this.plugins)
    this.server.register(fastifyCors, this.options.cors)
    this.server.register(fastifySensible)
    this.mount('/trpc', appRouter)
    await this.hooks.fire('post-server-setup', this)
    await this.server.listen({
      host: this.options.host,
      port: this.options.port
    })
    this.logger.info('App started')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mount(prefix: string, router: Router<any>) {
    this.server.register(fastifyTRPCPlugin, {
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
}
