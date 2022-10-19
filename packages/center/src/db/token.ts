import { nanoid } from 'nanoid'
import { defineCollectionSetup } from './base.js'

export interface IToken {
  _id: string
  userId: string
  subject: string
  created: number
}

export const setupTokenCollection = defineCollectionSetup(async ({ db }) => {
  const collection = db.collection<IToken>('token')
  await db.createIndex('token_userId', { userId: 1 })

  async function createToken(userId: string, subject = 'center') {
    const _id = nanoid()
    const created = Date.now()
    await collection.insertOne({ _id, userId, subject, created })
    return _id
  }

  return { collection, createToken }
})
