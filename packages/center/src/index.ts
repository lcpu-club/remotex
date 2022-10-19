import { appRouter, AppRouter } from './api/router.js'
import { tRPC } from './api/trpc.js'
import { CONFIG } from './config.js'
import { DbConn, setupDbConn } from './db/index.js'
import { setupHooks } from './hooks.js'
import { logger } from './logger.js'
import { runMitigation } from './mitigation/index.js'
import { Plugin, setupPlugins } from './plugin.js'
import { Scripts, setupScripts } from './scripts/index.js'
import { Server, setupServer } from './server.js'

declare module './mergeables.js' {
  interface IHookMap {
    'post-plugins-setup': [{ logger: typeof logger; tRPC: typeof tRPC }]
    'post-dbconn-setup': [DbConn]
    'post-server-setup': [Server]
    'post-scripts-setup': [Scripts]
  }
}

export async function startApp() {
  const hooks = await setupHooks()
  await setupPlugins({ hooks })
  await hooks.fire('post-plugins-setup', { logger, tRPC })
  const dbconn = await setupDbConn()
  await hooks.fire('post-dbconn-setup', dbconn)
  await runMitigation(dbconn)
  const server = await setupServer({ dbconn })
  await hooks.fire('post-server-setup', server)
  server.mount('/trpc', appRouter)
  await server.fastify.listen({
    host: CONFIG.server.host,
    port: CONFIG.server.port
  })
  logger.info('App started')
  console.log(server.fastify.printRoutes())
}

export async function startCli(script: string) {
  const hooks = await setupHooks()
  await setupPlugins({ hooks })
  await hooks.fire('post-plugins-setup', { logger, tRPC })
  const dbconn = await setupDbConn()
  await hooks.fire('post-dbconn-setup', dbconn)
  const scripts = await setupScripts()
  await hooks.fire('post-scripts-setup', scripts)
  await scripts.run(script)
}

export { Plugin, AppRouter }
