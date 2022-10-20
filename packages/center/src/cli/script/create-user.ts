import type { Script } from '.'
import { askString } from '../../util/index.js'

const run: Script = async (app) => {
  const name = await askString('name')
  const group = await askString('group')
  const id = await app.dbconn.user.create(name, group)
  console.log(`Created user ${name} with id ${id}`)
}

export default run
