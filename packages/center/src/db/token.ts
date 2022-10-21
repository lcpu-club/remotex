import { nanoid } from 'nanoid'
import { IGroupPolicies } from '../mergeables.js'
import { Initable } from '../util/index.js'
import { DbConn } from './index.js'

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90

export interface IToken {
  _id: string
  type: 'pre' | 'web' | 'app'
  userId: string
  prefixes: string[]
  createdAt: number
  expiresAt: number
  usedAt: number
}

export class TokenManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<IToken>('token')
  }

  async get(_id: string) {
    const token = await this.collection.findOne({ _id })
    if (!token) throw new Error('Bad token')
    return token
  }

  async create(info: Omit<IToken, '_id' | 'createdAt' | 'usedAt'>) {
    const _id = nanoid()
    const createdAt = Date.now()
    await this.collection.insertOne({ _id, ...info, createdAt, usedAt: 0 })
    return _id
  }

  async createCenterToken(userId: string) {
    return this.create({
      type: 'web',
      userId,
      prefixes: ['center:'],
      // Center token will be expired in 3 months regardless of usage
      expiresAt: Date.now() + THREE_MONTHS
    })
  }

  async purge(userId: string) {
    await this.collection.deleteMany({ userId })
  }

  async loadUserInfo<K extends keyof IGroupPolicies>(
    _id: string,
    policies: K[]
  ) {
    const token = await this.get(_id)
    return this.dbconn.user.loadUserInfo(token, policies)
  }
}
