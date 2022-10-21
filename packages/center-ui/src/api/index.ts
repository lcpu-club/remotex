import { createTRPCProxyClient, httpLink, TRPCClientError } from '@trpc/client'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { AppRouter } from '@remotex/center'
import { getUrl } from 'src/config'
import { post } from 'src/utils/broadcast'

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

async function getUserInfo() {
  try {
    return await client.user.info.query()
  } catch (err) {
    if (err instanceof TRPCClientError) {
      authToken.value = ''
      post('reload')
    }
  }
  return null
}

type UserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>

export const userInfo = useLocalStorage<UserInfo>('userInfo', null as never, {
  deep: true
})

if (isLoggedIn.value) {
  const info = await getUserInfo()
  info && (userInfo.value = info)
}
