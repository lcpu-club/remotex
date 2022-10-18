import { MongoClient, ObjectId } from 'mongodb'
import { logger } from '../logger.js'
import { MONGO_URI } from '../config.js'

export const client = new MongoClient(MONGO_URI)
await client.connect()
logger.info('Connected to MongoDB')
export const db = client.db()

export interface IBaseDocument {
  _id: ObjectId
}
