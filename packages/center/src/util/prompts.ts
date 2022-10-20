import prompts from 'prompts'

export async function askString(message: string) {
  const { input } = await prompts({
    type: 'text',
    name: 'input',
    message
  })
  return input
}

export async function askNumber(message: string) {
  const { input } = await prompts({
    type: 'number',
    name: 'input',
    message
  })
  return input
}

export async function askJson(message: string) {
  for (;;) {
    const { input } = await prompts({
      type: 'text',
      name: 'input',
      message
    })
    try {
      return JSON.parse(input)
    } catch (err) {
      console.error(err)
    }
  }
}
