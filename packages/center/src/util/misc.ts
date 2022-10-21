import fs from 'fs-extra'
import { dirname, join, normalize } from 'path'
import { fileURLToPath } from 'url'

export const APP_ROOT = normalize(
  join(dirname(fileURLToPath(import.meta.url)), '..', '..')
)

export const PACKAGE_JSON = await fs.readJSONSync(
  join(APP_ROOT, 'package.json')
)

export const VERSION: string = PACKAGE_JSON.version
