export interface ILoginMethod {
  name: string
  target: string
}

export interface IRuntimeConfig {
  baseUrl: string
  loginMethods: ILoginMethod[]
}

export const config: IRuntimeConfig = {
  baseUrl: 'http://localhost:3000/',
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
