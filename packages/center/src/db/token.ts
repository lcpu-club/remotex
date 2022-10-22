import { Filter } from 'mongodb'
import { nanoid } from 'nanoid'
import { IGroupPolicies } from '../contribution/index.js'
import { Initable } from '../util/index.js'
import { DbConn } from './index.js'

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90

export interface IToken {
  _id: string
  value: string
  type: 'web' | 'app'
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

  async get(where: Filter<IToken>) {
    const token = await this.collection.findOne(where, {
      projection: { value: 0 }
    })
    if (!token) throw new Error('Bad token')
    return token
  }

  async list(where: Filter<IToken>) {
    return this.collection.find(where, { projection: { value: 0 } }).toArray()
  }

  async create(info: Omit<IToken, '_id' | 'value' | 'createdAt' | 'usedAt'>) {
    const _id = nanoid()
    const value = nanoid()
    const createdAt = Date.now()
    await this.collection.insertOne({
      _id,
      value,
      ...info,
      createdAt,
      usedAt: 0
    })
    return value
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
    value: string,
    policies: K[]
  ) {
    const token = await this.get({ value })
    return this.dbconn.user.loadUserInfo(token, policies)
  }
}
