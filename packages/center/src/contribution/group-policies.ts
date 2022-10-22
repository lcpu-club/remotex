import { ContributionPoint } from './base.js'
import { IGroupPolicies } from './index.js'

export interface IGroupPoliciesMeta {
  description: string
}

export class GroupPolicies extends ContributionPoint<
  IGroupPolicies,
  IGroupPoliciesMeta
> {
  constructor() {
    super()
    this.set('center:access', {
      description: 'Access UserCenter'
    })
    this.set('center:admin', {
      description: 'Access UserCenter Administration'
    })
  }
}
