import { Initable } from '../util/index.js'
import { DbConn } from './index.js'

export interface ISystemKV {
  version: string
}

export interface ISystem<K extends keyof ISystemKV = keyof ISystemKV> {
  _id: K
  value: ISystemKV[K]
}

export class SystemManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<ISystem>('system')
  }

  async get<K extends keyof ISystemKV>(key: K): Promise<ISystemKV[K]> {
    const doc = await this.collection.findOne({ _id: key })
    if (!doc) throw new Error(`System key ${key} not found`)
    return doc.value
  }

  async set<K extends keyof ISystemKV>(key: K, value: ISystemKV[K]) {
    await this.collection.updateOne(
      { _id: key },
      { $set: { value } },
      { upsert: true }
    )
  }
}
