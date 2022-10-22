import { z } from 'zod'
import type { Plugin } from '../index.js'

const plugin: Plugin = (hooks) => {
  hooks.hook('post-plugin-setup', ({ logger }) => {
    logger.info('Setting up REST API plugin')
  })
  hooks.hook('post-server-setup', (app) => {
    const { server, dbconn } = app
    server.post(
      '/api/verify',
      {
        schema: {
          body: z.object({
            token: z.string(),
            policies: z
              .array(z.string().regex(/^[a-zA-Z0-9:]+$/))
              .min(1)
              .max(50)
          })
        }
      },
      async (req) => {
        const { token, policies } = req.body
        return dbconn.token.loadUserInfo(token, <never>policies)
      }
    )
  })
}

export default plugin
