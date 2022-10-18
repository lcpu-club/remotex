import Fastify from 'fastify'

export async function setupServer() {
  const fastify = Fastify({
    logger: true
  })
  return fastify
}
