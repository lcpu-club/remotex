import { z, ZodSchema } from 'zod'
import { ContributionPoint } from './base.js'
import { IUserAttributes } from './index.js'

export interface IUserAttributesMeta {
  schema: ZodSchema
  allowUserEdit: boolean
  description: string
}

export class UserAttributes extends ContributionPoint<
  IUserAttributes,
  IUserAttributesMeta
> {
  constructor() {
    super()
    this.set('username', {
      schema: z.string().min(5).max(32),
      allowUserEdit: true,
      description: 'Username'
    })
    this.set('nickname', {
      schema: z.string().min(2).max(32),
      allowUserEdit: true,
      description: 'Nickname'
    })
    this.set('email', {
      schema: z.string().email(),
      allowUserEdit: true,
      description: 'Email'
    })
  }
}
