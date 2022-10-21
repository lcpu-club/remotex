/* eslint-disable @typescript-eslint/no-empty-interface */
// This file contains mergeable interfaces

export interface IUserAttributes {
  realname: string
  email: string
}

export interface IUserAuthSources {}

export interface IGroupAttributes {
  name: string
}

export interface IGroupPolicies {
  'center:admin': boolean
}

export interface IHookMap {}
