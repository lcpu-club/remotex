import { sep } from 'path'
import { CONFIG } from './config.js'
import type { Hooks } from './hooks.js'
import { logger } from './logger.js'

export type Plugin = (hooks: Hooks) => void | Promise<void>

async function tryImport(path: string): Promise<unknown> {
  try {
    return await import(path)
  } catch (err) {
    return null
  }
}

async function loadPlugin(path: string): Promise<Plugin> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let plugin: any = null
  if (path.startsWith('@')) {
    // scoped package
    plugin = await tryImport(path)
  } else if (path.includes(sep)) {
    // path to package
    plugin = await tryImport(path)
  } else {
    // internal plugin or external package
    plugin = await tryImport(`./plugins/${path}.js`)
    plugin = plugin ?? (await tryImport(path))
  }
  if (plugin) return plugin.default as Plugin
  throw new Error(`Could not load plugin ${path}`)
}

export async function setupPlugins(options: { hooks: Hooks }) {
  for (const path of CONFIG.plugins) {
    const plugin = await loadPlugin(path)
    await plugin(options.hooks)
    logger.info(`Loaded plugin ${path}`)
  }
}
