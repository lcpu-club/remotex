import { Logger } from 'pino'
import { IHookMap } from '../contribution/index.js'

type HookName = keyof IHookMap
type HookCallback<N extends HookName> = (
  ...args: IHookMap[N]
) => void | Promise<void>
type CallbackMap = Record<string, ((...args: unknown[]) => never)[]>

export interface IHookManagerInjects {
  logger: Logger
}

export class HookManager {
  logger
  callbackMap
  constructor(injects: IHookManagerInjects) {
    this.logger = injects.logger
    this.callbackMap = Object.create(null) as CallbackMap
  }

  private getCallbacks<T extends keyof IHookMap>(name: T): HookCallback<T>[] {
    return this.callbackMap[name] || (this.callbackMap[name] = [])
  }

  hook<T extends keyof IHookMap>(name: T, handler: HookCallback<T>) {
    const callbacks = this.getCallbacks(name)
    callbacks.push(handler)
  }

  async fire<T extends keyof IHookMap>(
    name: T,
    ...args: IHookMap[T]
  ): Promise<void> {
    const callbacks = this.getCallbacks(name)
    for (const callback of callbacks) {
      await callback(...args)
    }
  }
}
