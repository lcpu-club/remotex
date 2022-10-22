import { Filter } from 'mongodb'
import { IGroupAttributes, IGroupPolicies } from '../contribution/index.js'
import { Initable } from '../util/index.js'
import { DbConn } from './index.js'

export interface IGroup {
  _id: string
  attributes: Partial<IGroupAttributes>
  policies: Partial<IGroupPolicies>
}

export class GroupManager extends Initable {
  collection
  constructor(public dbconn: DbConn) {
    super(dbconn.logger)
    this.collection = dbconn.db.collection<IGroup>('group')
  }

  async get(where: Filter<IGroup>) {
    const group = await this.collection.findOne(where)
    if (!group) throw new Error('Group not found')
    return group
  }

  async list(where: Filter<IGroup>) {
    return this.collection.find(where).toArray()
  }

  async create(_id: string, policies: Partial<IGroupPolicies> = {}) {
    await this.collection.insertOne({ _id, attributes: {}, policies })
  }

  async remove(_id: string) {
    await this.collection.deleteOne({ _id })
  }

  async getPolicies<K extends keyof IGroupPolicies>(
    _id: string,
    policies: K[]
  ) {
    const projection = Object.fromEntries(
      policies.map((k) => [`policies.${k}`, 1])
    )
    const group = await this.collection.findOne({ _id }, { projection })
    if (!group) throw new Error(`Group ${_id} not found`)
    return group.policies as Pick<IGroupPolicies, K>
  }

  async setPolicies(_id: string, policies: Partial<IGroupPolicies> = {}) {
    const update = {
      $set: Object.fromEntries(
        Object.entries(policies).map(([k, v]) => [`policies.${k}`, v])
      )
    }
    await this.collection.updateOne({ _id }, update)
  }
}
