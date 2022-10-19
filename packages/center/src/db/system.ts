import { defineCollectionSetup } from './base.js'

export interface ISystemKV {
  version: string
}

export interface ISystem<K extends keyof ISystemKV = keyof ISystemKV> {
  _id: K
  value: ISystemKV[K]
}

export const setupSystemCollection = defineCollectionSetup(async ({ db }) => {
  const collection = db.collection<ISystem>('group')

  async function get<K extends keyof ISystemKV>(key: K): Promise<ISystemKV[K]> {
    const doc = await collection.findOne({ _id: key })
    if (!doc) throw new Error(`System key ${key} not found`)
    return doc.value
  }

  async function set<K extends keyof ISystemKV>(key: K, value: ISystemKV[K]) {
    await collection.updateOne(
      { _id: key },
      { $set: { value } },
      { upsert: true }
    )
  }

  return { collection, get, set }
})
