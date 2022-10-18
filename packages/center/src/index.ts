import { setupDb } from './db/index.js'
import { setupHooks } from './hooks.js'
import { logger } from './logger.js'
import { IS_ENTRY_MODULE } from './util/index.js'

declare module './mergeables.js' {
  interface IHookMap {
    'db-connected': [Awaited<ReturnType<typeof setupDb>>]
  }
}

async function startApp() {
  const hooks = await setupHooks()
  const db = await setupDb()
  await hooks.fire('db-connected', db)
}

if (IS_ENTRY_MODULE) {
  startApp().catch((err) => logger.error(err))
}
