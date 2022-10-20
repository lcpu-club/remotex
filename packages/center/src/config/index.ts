import type { IAppOptions } from '../app.js'
import type { ICliAppOptions } from '../cli/app.js'

const PREFIX = 'CENTER_'
const factory =
  <T>(transform: (val: string) => T) =>
  (key: string, defaultValue?: T) => {
    const value = process.env[PREFIX + key]
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Missing environment variable: ${PREFIX + key}`)
      }
      return defaultValue
    }
    return transform(value)
  }
const str = factory((x) => x)
const num = factory((x) => parseInt(x, 10))
// const bool = factory((x) => x === 'true')
const json = factory((x) => JSON.parse(x))

export const CONFIG: IAppOptions & ICliAppOptions = {
  db: {
    uri: str('MONGO_URI', 'mongodb://localhost:27017/remotex_center')
  },
  plugins: {
    plugins: json('PLUGINS', ['password-auth'])
  },
  port: num('SERVER_PORT', 3000),
  host: str('SERVER_HOST', '127.0.0.1'),
  cors: json('SERVER_CORS', { origin: true })
}
