import { startApp } from './index.js'
import { logger } from './logger.js'

startApp().catch((err) => logger.error(err))
