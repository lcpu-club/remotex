import { createTRPCProxyClient, httpLink } from '@trpc/client'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { AppRouter } from '@remotex/center'
import { getUrl } from 'src/config'

const authToken = useLocalStorage('authToken', '')
export const isLoggedIn = computed(() => !!authToken.value)

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: getUrl('/trpc'),
      headers() {
        return {
          'X-Auth-Token': authToken.value
        }
      }
    })
  ]
})
