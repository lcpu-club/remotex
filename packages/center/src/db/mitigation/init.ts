import type { DbConn } from '../index.js'

export async function initDatabase(dbconn: DbConn) {
  const { user, group, system } = dbconn
  await group.create('admin', 'Admin Group', { 'center:admin': true })
  await group.create('default', 'Default Group', {})
  await user.create('admin', 'admin')
  // TODO: set indexes
  await system.set('version', '0.0.1')
}
