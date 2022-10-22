import { Filter } from 'mongodb'
import { nanoid } from 'nanoid'
import {
  IUserAttributes,
  IGroupPolicies,
  IUserAuthSources
} from '../contribution/index.js'
import { Initable } from '../util/index.js'
import { IGroup } from './group.js'
import { DbConn } from './index.js'
import { IToken } from './token.js'

export interface IUser {
  _id: string
  groupId: string

  attributes: Partial<IUserAttributes>
  authSources: Partial<IUserAuthSources>
}

export type UserInfo<K extends keyof IGroupPolicies> = Pick<
  IUser,
  '_id' | 'attributes'
> & {
  group: Pick<IGroup, '_id' | 'attributes'> & {
    policies: Pick<IGroupPolicies, K>
  }
}

export class UserManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<IUser>('user')
  }

  async create(username: string, groupId: string) {
    const _id = nanoid()
    await this.collection.insertOne({
      _id,
      groupId,
      attributes: {
        username
      },
      authSources: {}
    })
    return _id
  }

  async setGroup(_id: string, groupId: string) {
    await this.dbconn.token.purge(_id)
    await this.collection.updateOne({ _id }, { $set: { groupId } })
  }

  async loadUserInfo<K extends keyof IGroupPolicies>(
    token: IToken,
    policies: K[]
  ) {
    const { userId, prefixes } = token
    if (policies.some((p) => !prefixes.some((x) => p.startsWith(x)))) {
      throw new Error('Bad token')
    }
    const projection = Object.fromEntries(
      policies.map((k) => [`group.policies.${k}`, 1])
    )
    const user = await this.collection
      .aggregate([
        { $match: { _id: userId } },
        {
          $lookup: {
            from: 'group',
            localField: 'groupId',
            foreignField: '_id',
            as: 'group'
          }
        },
        { $unwind: '$group' },
        {
          $project: {
            _id: 1,
            attributes: 1,
            'group._id': 1,
            'group.attributes': 1,
            ...projection
          }
        }
      ])
      .next()
    return user as UserInfo<K>
  }

  async getAuthSource<K extends keyof IUserAuthSources>(
    cond: Filter<IUser>,
    source: K
  ): Promise<IUserAuthSources[K] | null> {
    const user = await this.collection.findOne(cond)
    if (!user) return null
    return user.authSources[source] ?? null
  }

  async setAuthSource<K extends keyof IUserAuthSources>(
    _id: string,
    source: K,
    value: IUserAuthSources[K]
  ) {
    await this.collection.updateOne(
      { _id },
      { $set: { [`authSources.${source}`]: value } }
    )
  }

  async removeAuthSource<K extends keyof IUserAuthSources>(
    _id: string,
    source: K
  ) {
    await this.collection.updateOne(
      { _id },
      { $unset: { [`authSources.${source}`]: '' } }
    )
  }
}
