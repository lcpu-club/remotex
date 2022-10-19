import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from '@remotex/center'

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:3000/api'
    })
  ]
})
