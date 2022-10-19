import { setupDb } from './db/index.js'
import { setupHooks } from './hooks.js'
import { logger } from './logger.js'
import { Plugin, setupPlugins } from './plugin.js'

declare module './mergeables.js' {
  interface IHookMap {
    'post-plugins-setup': [{ logger: typeof logger }]
    'post-db-setup': [Awaited<ReturnType<typeof setupDb>>]
  }
}

export async function startApp() {
  const hooks = await setupHooks()
  await setupPlugins({ hooks })
  await hooks.fire('post-plugins-setup', { logger })
  const db = await setupDb()
  await hooks.fire('post-db-setup', db)
}

export { Plugin }
