import { dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs-extra'
import type { DbConn } from '../db/index.js'
import semver from 'semver'
import { logger } from '../logger.js'

export type Mitigation = (conn: DbConn) => Promise<void>

async function loadMitigations() {
  const root = join(dirname(fileURLToPath(import.meta.url)), 'versions')
  const names = await fs.readdir(root)
  const getVersion = (name: string) => name.substring(0, name.length - 3)
  return Promise.all(
    names
      .filter((name) => name.endsWith('.js'))
      .sort((a, b) => (semver.gt(getVersion(a), getVersion(b)) ? 1 : -1))
      .map((name) =>
        import(pathToFileURL(join(root, name)).href).then((mod) => ({
          version: getVersion(name),
          run: mod.default as Mitigation
        }))
      )
  )
}

async function initDatabase(conn: DbConn) {
  await conn.system.set('version', '0.0.1')
}

export async function runMitigation(conn: DbConn) {
  const mitigations = await loadMitigations()
  logger.info(`Loaded ${mitigations.length} mitigations`)
  const doc = await conn.system.collection.findOne({ _id: 'version' })
  if (!doc) {
    logger.info('Database initializing')
    await initDatabase(conn)
    logger.info('Database initialized')
  }
  const version = await conn.system.get('version')
  // TODO: skip mitigations when already at newest version
  for (const mitigation of mitigations) {
    if (semver.lte(mitigation.version, version)) continue
    logger.info(`Running mitigation ${mitigation.version}`)
    await mitigation.run(conn)
    await conn.system.set('version', mitigation.version)
  }
}
