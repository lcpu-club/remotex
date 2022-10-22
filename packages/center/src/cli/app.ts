import pino from 'pino'
import { DbConn, IDbConnOptions } from '../db/index.js'
import { HookManager } from '../hook/index.js'
import { IPluginManagerOptions, PluginManager } from '../plugin/index.js'
import { Initable } from '../util/index.js'
import { ScriptManager } from './script/index.js'

declare module '../contribution/index.js' {
  interface IHookMap {
    ['post-script-setup']: [ScriptManager]
  }
}

export interface ICliAppOptions {
  db: IDbConnOptions
  plugins: IPluginManagerOptions
}

export class CliApp extends Initable {
  hooks
  dbconn
  plugins
  scripts
  constructor(options: ICliAppOptions) {
    const logger = pino()
    super(logger)
    this.hooks = new HookManager({ logger })
    this.dbconn = new DbConn({ logger }, options.db)
    this.plugins = new PluginManager(
      { logger, hooks: this.hooks },
      options.plugins
    )
    this.scripts = new ScriptManager({ logger })
  }

  async init() {
    await this.dbconn.init()
    this.hooks.fire('post-dbconn-setup', this.dbconn)
    await this.plugins.init()
    this.hooks.fire('post-plugin-setup', this.plugins)
    await this.scripts.init()
    this.hooks.fire('post-script-setup', this.scripts)
  }

  async run(script: string) {
    return this.scripts.run(script, this)
  }
}
