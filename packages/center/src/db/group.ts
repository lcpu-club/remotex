import { IGroupPolicies } from '../mergeables.js'
import { defineCollectionSetup } from './base.js'

export interface IGroup {
  _id: string
  name: string
  policies: IGroupPolicies
}

export const setupGroupCollection = defineCollectionSetup(({ db }) => {
  const collection = db.collection('group')
  return { collection }
})
