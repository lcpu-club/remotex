import { z } from 'zod'
import bcrypt from 'bcrypt'
import type { Plugin } from '../index.js'
import { askString } from '../util/index.js'

declare module '../contribution/index.js' {
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
  hooks.hook('post-contribution-setup', (contrib) => {
    contrib.userAuthSources.set('password', {
      description: 'Password Login'
    })
  })
  hooks.hook('post-dbconn-setup', async (dbconn) => {
    await dbconn.user.collection.createIndex(
      { 'attributes.username': 1 },
      { unique: true }
    )
  })
  hooks.hook('post-script-setup', (scripts) => {
    scripts.addScript('password:set-password', async (app) => {
      const username = await askString('Username')
      const user = await app.dbconn.user.collection.findOne(
        { 'attributes.username': username },
        { projection: { _id: 1 } }
      )
      if (!user) {
        console.log('User not found')
        return
      }
      const password = await askString('Password')
      const hash = await bcrypt.hash(password, 10)
      await app.dbconn.user.setAuthSource(user._id, 'password', { hash })
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
        const user = await dbconn.user.collection.findOne(
          { 'attributes.username': username },
          {
            projection: {
              _id: 1,
              'authSources.password': 1
            }
          }
        )
        if (!user || !user.authSources.password)
          throw server.httpErrors.forbidden()
        const result = await bcrypt.compare(
          password,
          user.authSources.password.hash
        )
        if (!result) throw server.httpErrors.forbidden()
        const token = await dbconn.token.createCenterToken(user._id)
        return { token }
      }
    )
  })
}

export default plugin
