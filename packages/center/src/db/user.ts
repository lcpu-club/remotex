import { IUserAuthSources } from '../mergeables.js'
import { defineCollectionSetup, IBaseDocument } from './base.js'

export interface IUser extends IBaseDocument {
  username: string
  group: string
  authSources: IUserAuthSources
}

export const setupUserCollection = defineCollectionSetup(({ db }) => {
  const collection = db.collection('user')
  return { collection }
})
