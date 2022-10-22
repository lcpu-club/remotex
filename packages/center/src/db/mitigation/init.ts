import type { DbConn } from '../index.js'

export async function initDatabase(dbconn: DbConn) {
  const { user, group, system, token } = dbconn
  await group.create('admin', { 'center:access': true, 'center:admin': true })
  await group.create('default', { 'center:access': true })
  await user.create('admin', 'admin')
  await token.collection.createIndex({ value: 1 }, { unique: true })
  await system.set('version', '0.0.1')
}
