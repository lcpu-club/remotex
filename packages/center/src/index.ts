import { createServer } from './server'

const server = await createServer()

await server.listen({ port: 3000 })
