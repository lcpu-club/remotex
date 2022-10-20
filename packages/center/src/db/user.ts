import { Filter } from 'mongodb'
import { nanoid } from 'nanoid'
import { IGroupPolicies, IUserAuthSources } from '../mergeables.js'
import { Initable } from '../util/initable.js'
import { DbConn } from './index.js'

export interface IUser {
  _id: string
  username: string
  groupId: string

  name: string

  authSources: Partial<IUserAuthSources>
}

export class UserManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<IUser>('user')
  }

  async create(name: string, groupId: string) {
    const _id = nanoid()
    await this.collection.insertOne({
      _id,
      username: name,
      name,
      groupId,
      authSources: {}
    })
  }

  async setGroup(_id: string, groupId: string) {
    await this.dbconn.token.purge(_id)
    await this.collection.updateOne({ _id }, { $set: { groupId } })
  }

  async getPolicies<K extends keyof IGroupPolicies>(
    _id: string,
    policies: K[]
  ) {
    const projection = Object.fromEntries(
      policies.map((k) => [`policies.${k}`, 1])
    )
    const group = await this.dbconn.user.collection
      .aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: 'group',
            localField: 'groupId',
            foreignField: '_id',
            as: 'group'
          }
        },
        { $unwind: '$group' },
        { $replaceRoot: { newRoot: '$group' } },
        { $project: projection }
      ])
      .next()
    if (!group) throw new Error(`Group ${_id} not found`)
    return group.policies as Pick<IGroupPolicies, K>
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
