import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs-extra'
import { Initable } from '../../util/initable.js'
import { CliApp } from '../app.js'
import { Logger } from 'pino'

export type Script = (app: CliApp) => Promise<void>

async function loadScripts() {
  const root = dirname(fileURLToPath(import.meta.url))
  const names = await fs.readdir(root)
  return Promise.all(
    names
      .filter((name) => name.endsWith('.js') && name !== 'index.js')
      .map((name) =>
        import(pathToFileURL(join(root, name)).href).then((mod) => ({
          name: name.substring(0, name.length - 3),
          main: mod.default as Script
        }))
      )
  )
}

export interface IScriptManagerInjects {
  logger: Logger
}

export class ScriptManager extends Initable {
  scripts: Record<string, Script> = Object.create(null)

  constructor(public injects: IScriptManagerInjects) {
    super(injects.logger)
  }

  addScript(name: string, main: Script) {
    if (name in this.scripts) {
      throw new Error(`Script ${name} already exists`)
    }
    this.scripts[name] = main
  }

  async setup() {
    const internalScripts = await loadScripts()
    internalScripts.forEach((script) =>
      this.addScript(script.name, script.main)
    )
    this.logger.info(`Loaded ${internalScripts.length} internal scripts`)
  }

  async run(script: string, app: CliApp) {
    if (!(script in this.scripts)) {
      console.log(`Script ${script} does not exist`)
      console.log('Available scripts:')
      console.log(Object.keys(this.scripts).join('\n'))
      process.exit(1)
    }
    const start = Date.now()
    let failed = false
    try {
      await this.scripts[script](app)
    } catch (err) {
      console.error(err)
      failed = true
    }
    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`Script ${script} finished in ${duration}s`)
    process.exit(failed ? 1 : 0)
  }
}
