/* eslint-disable @typescript-eslint/no-empty-interface */
// This file contains mergeable interfaces

export interface IUserAttributes {
  username: string
  realname: string
  email: string
}

export interface IUserAuthSources {}

export interface IGroupAttributes {
  name: string
}

export interface IGroupPolicies {
  'center:access': boolean
  'center:admin': boolean
}

export interface IHookMap {}
