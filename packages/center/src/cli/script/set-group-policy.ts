import type { Script } from '.'
import { askJson, askString } from '../../util/index.js'

const run: Script = async (app) => {
  const id = await askString('id')
  const name = await askString('policy name')
  const value = await askJson('policy value')
  await app.dbconn.group.setPolicies(id, {
    [name]: value
  })
  console.log(`Successfully set policy ${name} for group ${id}`)
}

export default run
