import type { Plugin } from '../index.js'

const plugin: Plugin = ({ hook }) => {
  hook('post-plugins-setup', ({ logger }) => {
    logger.info('Setting up password auth plugin')
  })
}

export default plugin
