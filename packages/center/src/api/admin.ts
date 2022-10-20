import { CONFIG } from '../config/index.js'
import { adminProcedure, tRPC } from './trpc.js'

export const adminRouter = tRPC.router({
  config: adminProcedure.query(async () => CONFIG)
})
