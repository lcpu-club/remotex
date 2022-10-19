// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const PACKAGE_JSON = await import('../../package.json', {
  assert: { type: 'json' }
}).then((mod) => mod.default)

export const VERSION: string = PACKAGE_JSON.version
