export interface ILoginMethod {
  name: string
  target?: string
  href?: string
}

export interface IRuntimeConfig {
  baseUrl: string
  loginMethods: ILoginMethod[]
}

export const config: IRuntimeConfig = {
  baseUrl: window.location.pathname,
  loginMethods: [
    { name: 'Password', target: '/login/password' }
    // More login methods here
  ]
}

export function getUrl(path: string) {
  let base = config.baseUrl
  if (base.endsWith('/')) base = base.slice(0, -1)
  if (path.startsWith('/')) path = path.slice(1)
  return base + '/' + path
}

try {
  const resp = await fetch('config.json')
  const data = await resp.json()
  Object.assign(config, data)
} catch (err) {
  console.log(err)
}
