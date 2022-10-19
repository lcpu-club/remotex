import { IUserAuthSources } from '../mergeables.js'
import { defineCollectionSetup } from './base.js'

export interface IUser {
  _id: string
  name: string
  groupId: string

  authSources: IUserAuthSources
}

export const setupUserCollection = defineCollectionSetup(async ({ db }) => {
  const collection = db.collection<IUser>('user')
  await db.createIndex('user_username', { name: 1 }, { unique: true })
  return { collection }
})
