import Fastify from 'fastify'

export async function createServer() {
  const fastify = Fastify({
    logger: true
  })
  //
  return fastify
}
