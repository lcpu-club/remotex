import { IGroupPolicies } from '../mergeables.js'
import { defineCollectionSetup } from './base.js'

export interface IGroup {
  _id: string
  name: string
  policies: IGroupPolicies
}

export const setupGroupCollection = defineCollectionSetup(async ({ db }) => {
  const collection = db.collection<IGroup>('group')
  return { collection }
})
