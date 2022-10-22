import { z, ZodSchema } from 'zod'
import { ContributionPoint } from './base.js'
import { IGroupAttributes } from './index.js'

export interface IGroupAttributesMeta {
  schema: ZodSchema
  description: string
}

export class GroupAttributes extends ContributionPoint<
  IGroupAttributes,
  IGroupAttributesMeta
> {
  constructor() {
    super()
    this.set('name', {
      schema: z.string(),
      description: 'Username'
    })
  }
}
