export async function setupScripts() {
  const scripts: Record<string, () => Promise<void>> = Object.create(null)
  function addScript(name: string, main: () => Promise<void>) {
    if (name in scripts) {
      throw new Error(`Script ${name} already exists`)
    }
    scripts[name] = main
  }
  async function run(script: string) {
    if (!(script in scripts)) {
      console.log(`Script ${script} does not exist`)
      console.log('Available scripts:')
      console.log(Object.keys(scripts).join('\n'))
      process.exit(1)
    }
    const start = Date.now()
    let failed = false
    try {
      await scripts[script]()
    } catch (err) {
      console.error(err)
      failed = true
    }
    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`Script ${script} finished in ${duration}s`)
    process.exit(failed ? 1 : 0)
  }

  return { addScript, run }
}

export type Scripts = Awaited<ReturnType<typeof setupScripts>>
