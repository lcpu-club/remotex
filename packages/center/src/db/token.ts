import { nanoid } from 'nanoid'
import { Initable } from '../util/index.js'
import { DbConn } from './index.js'

export interface IToken {
  _id: string
  userId: string
  subject: string
  created: number
}

export class TokenManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<IToken>('token')
  }

  async get(_id: string) {
    return this.collection.findOne({ _id })
  }

  async create(userId: string, subject = 'center') {
    const _id = nanoid()
    const created = Date.now()
    await this.collection.insertOne({ _id, userId, subject, created })
    return _id
  }

  async purge(userId: string) {
    await this.collection.deleteMany({ userId })
  }
}
