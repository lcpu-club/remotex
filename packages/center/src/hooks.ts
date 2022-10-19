import { IHookMap } from './mergeables.js'

type HookName = keyof IHookMap
type HookCallback<N extends HookName> = (
  ...args: IHookMap[N]
) => void | Promise<void>

export async function setupHooks() {
  const callbackMap = Object.create(null) as Record<
    string,
    ((...args: unknown[]) => never)[]
  >

  function getCallbacks<T extends keyof IHookMap>(name: T): HookCallback<T>[] {
    return callbackMap[name] || (callbackMap[name] = [])
  }

  function hook<T extends keyof IHookMap>(name: T, handler: HookCallback<T>) {
    const callbacks = getCallbacks(name)
    callbacks.push(handler)
  }

  async function fire<T extends keyof IHookMap>(
    name: T,
    ...args: IHookMap[T]
  ): Promise<void> {
    const callbacks = getCallbacks(name)
    for (const callback of callbacks) {
      await callback(...args)
    }
  }

  return { hook, fire }
}

export type Hooks = Awaited<ReturnType<typeof setupHooks>>
