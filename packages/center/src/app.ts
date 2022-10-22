import fastify from 'fastify'
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import fastifyStatic from '@fastify/static'
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
import * as tRPC from './api/trpc.js'
import { createContext } from './api/trpc.js'
import { appRouter } from './api/router.js'
import { ContributionManager } from './contribution/index.js'

declare module './contribution/index.js' {
  interface IHookMap {
    'post-contribution-setup': [ContributionManager]
    'post-dbconn-setup': [DbConn]
    'post-plugin-setup': [PluginManager]
    'post-server-setup': [App, typeof tRPC]
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
  static: string
  trustProxy: boolean | string | string[] | number
}

export class App extends Initable {
  contributions
  hooks
  dbconn
  plugins
  server

  constructor(public options: IAppOptions) {
    const logger = pino()
    super(logger)
    this.contributions = new ContributionManager()
    this.hooks = new HookManager({ logger })
    this.dbconn = new DbConn({ logger }, options.db)
    this.plugins = new PluginManager(
      { logger, hooks: this.hooks },
      options.plugins
    )
    const server = fastify({ logger, trustProxy: options.trustProxy })
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)
    this.server = server.withTypeProvider<ZodTypeProvider>()
    this.server.decorate('app', this as App)
  }

  async init() {
    await this.plugins.init()
    await this.hooks.fire('post-plugin-setup', this.plugins)
    await this.hooks.fire('post-contribution-setup', this.contributions)
    await this.dbconn.init()
    await this.hooks.fire('post-dbconn-setup', this.dbconn)
    await this.server.register(fastifyCors, this.options.cors)
    await this.server.register(fastifySensible)
    await this.mount('/trpc', appRouter)
    await this.hooks.fire('post-server-setup', this, tRPC)
    await this.server.register(fastifyStatic, {
      root: this.options.static
    })
    await this.server.listen({
      host: this.options.host,
      port: this.options.port
    })
    this.logger.info('App started')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mount(prefix: string, router: Router<any>) {
    return this.server.register(fastifyTRPCPlugin, {
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
