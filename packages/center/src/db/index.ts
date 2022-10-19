import { MongoClient } from 'mongodb'
import { CONFIG } from '../config.js'
import { logger } from '../logger.js'
import { setupGroupCollection } from './group.js'
import { setupSystemCollection } from './system.js'
import { setupTokenCollection } from './token.js'
import { setupUserCollection } from './user.js'

export async function setupDbConn() {
  const client = new MongoClient(CONFIG.db.uri)
  await client.connect()
  logger.info('Connected to MongoDB')
  const db = client.db()
  const user = await setupUserCollection({ client, db })
  const group = await setupGroupCollection({ client, db })
  const token = await setupTokenCollection({ client, db })
  const system = await setupSystemCollection({ client, db })
  return { client, db, user, group, token, system }
}

export type DbConn = Awaited<ReturnType<typeof setupDbConn>>
