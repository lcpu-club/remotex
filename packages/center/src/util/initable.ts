import { Logger } from 'pino'

// eslint-disable-next-line @typescript-eslint/ban-types
export function getClassName(o: Object) {
  return o.constructor.name
}

export abstract class Initable {
  private _initialized = false

  constructor(public logger: Logger) {}

  /**
   * Initialize the object
   * Override this method to control initialization
   */
  async init(): Promise<void> {
    if (this._initialized) return
    this._initialized = true
    this.logger.info(`Initializing ${getClassName(this)}`)
    await this.setup()
    for (const descriptor of Object.values(
      Object.getOwnPropertyDescriptors(this)
    )) {
      if (typeof descriptor.value !== 'object') continue
      if (descriptor.value instanceof Initable) {
        await descriptor.value.init()
      }
    }
  }

  /**
   * This function is called first when the object is initialized
   * Override this method to control initialization
   */
  async setup() {
    // Override this method
  }
}
