import { MongoClient } from 'mongodb'
import { Initable } from '../util/initable.js'
import { IUser, UserManager } from './user.js'
import { IGroup, GroupManager } from './group.js'
import { ISystem, SystemManager } from './system.js'
import { IToken, TokenManager } from './token.js'
import { Logger } from 'pino'
import { runMitigation } from './mitigation/index.js'

export interface IDbConnInjects {
  logger: Logger
}

export interface IDbConnOptions {
  uri: string
}

export class DbConn extends Initable {
  client
  db
  user
  group
  token
  system

  constructor(injects: IDbConnInjects, options: IDbConnOptions) {
    super(injects.logger)
    this.client = new MongoClient(options.uri)
    this.db = this.client.db()
    this.user = new UserManager(this)
    this.group = new GroupManager(this)
    this.token = new TokenManager(this)
    this.system = new SystemManager(this)
  }

  async setup(): Promise<void> {
    await this.client.connect()
    this.logger.info('Connected to MongoDB')
    await runMitigation(this)
  }
}

export { IUser, IGroup, ISystem, IToken }
