import { z } from 'zod'
import bcrypt from 'bcrypt'
import type { Plugin } from '../index.js'
import { askString } from '../util/index.js'

declare module '../mergeables.js' {
  interface IUserAuthSources {
    password: {
      hash: string
    }
  }
}

const plugin: Plugin = (hooks) => {
  hooks.hook('post-plugin-setup', ({ logger }) => {
    logger.info('Setting up password auth plugin')
  })
  hooks.hook('post-script-setup', (scripts) => {
    scripts.addScript('password:set-password', async (app) => {
      const userId = await askString('User ID')
      const password = await askString('Password')
      const hash = await bcrypt.hash(password, 10)
      await app.dbconn.user.setAuthSource(userId, 'password', { hash })
    })
  })
  hooks.hook('post-server-setup', (app) => {
    const { server, dbconn } = app
    server.post(
      '/api/auth/password/login',
      {
        schema: {
          body: z.object({
            username: z.string(),
            password: z.string()
          })
        }
      },
      async (req) => {
        const { username, password } = req.body
        const source = await dbconn.user.getAuthSource({ username }, 'password')
        if (!source) throw server.httpErrors.forbidden()
        const result = await bcrypt.compare(password, source.hash)
        if (!result) throw server.httpErrors.forbidden()
        const token = await dbconn.token.create(username)
        return { token }
      }
    )
  })
}

export default plugin
