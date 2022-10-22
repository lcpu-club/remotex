// This file contains contribution/index interfaces
/* eslint-disable @typescript-eslint/no-empty-interface */
import { GroupAttributes } from './group-attributes.js'
import { GroupPolicies } from './group-policies.js'
import { UserAttributes } from './user-attributes.js'
import { UserAuthSources } from './user-auth-sources.js'

export interface IUserAuthSources {}

export interface IUserAttributes {
  username: string
  nickname: string
  email: string
}

export interface IGroupAttributes {
  name: string
}

export interface IGroupPolicies {
  'center:access': boolean
  'center:admin': boolean
}

export interface IHookMap {}

export class ContributionManager {
  userAttributes
  userAuthSources
  groupAttributes
  groupPolicies

  constructor() {
    this.userAttributes = new UserAttributes()
    this.userAuthSources = new UserAuthSources()
    this.groupAttributes = new GroupAttributes()
    this.groupPolicies = new GroupPolicies()
  }
}
