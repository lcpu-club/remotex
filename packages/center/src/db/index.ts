import { MongoClient } from 'mongodb'
import { MONGO_URI } from '../config.js'
import { logger } from '../logger.js'
import { setupUserCollection } from './user.js'

export async function setupDb() {
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  logger.info('Connected to MongoDB')
  const db = client.db()
  const user = await setupUserCollection({ client, db })
  return { client, db, user }
}
