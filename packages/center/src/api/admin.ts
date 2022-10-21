import { CONFIG } from '../config/index.js'
import { adminProcedure, router } from './trpc.js'

export const adminRouter = router({
  config: adminProcedure.query(async () => CONFIG)
})
