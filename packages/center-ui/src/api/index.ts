import { createTRPCProxyClient, httpLink } from '@trpc/client'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { AppRouter } from '@remotex/center'

const authToken = useLocalStorage('authToken', '')
export const isLoggedIn = computed(() => !!authToken.value)

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:3000/api',
      headers() {
        return {
          'X-Auth-Token': authToken.value
        }
      }
    })
  ]
})
