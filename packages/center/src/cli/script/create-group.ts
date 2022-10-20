import type { Script } from '.'
import { askString } from '../../util/index.js'

const run: Script = async (app) => {
  const id = await askString('id')
  await app.dbconn.group.create(id)
  console.log(`Created group ${id}`)
}

export default run
