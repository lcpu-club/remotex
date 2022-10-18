import { Db, MongoClient, ObjectId } from 'mongodb'

export interface IBaseDocument {
  _id: ObjectId
}

export function defineCollectionSetup<T>(
  setup: (options: { client: MongoClient; db: Db }) => T
) {
  return setup
}
