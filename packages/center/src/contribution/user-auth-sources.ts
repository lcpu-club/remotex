import { IUserAuthSources } from './index.js'
import { ContributionPoint } from './base.js'

export interface IUserAuthSourcesMeta {
  description: string
}

export class UserAuthSources extends ContributionPoint<
  IUserAuthSources,
  IUserAuthSourcesMeta
> {
  constructor() {
    super()
  }
}
