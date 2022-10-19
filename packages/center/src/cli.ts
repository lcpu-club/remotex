import minimist from 'minimist'
import { startApp, startCli } from './index.js'
import { logger } from './logger.js'

const argv = minimist(process.argv.slice(2))

if (argv.v || argv.version) {
  const source = '../package.json'
  console.log(
    await import(source, { assert: { type: 'json' } }).then(
      (mod) => mod.default.version
    )
  )
  process.exit(0)
}

if (argv.h || argv.help) {
  console.log('Usage: cli.js [options]')
  console.log('Options:')
  console.log('  -h, --help          Show this help')
  console.log('  -v, --version       Show version')
  console.log('  -s, --script <name> Show version')
  process.exit(0)
}

if (argv.s || argv.script) {
  await startCli(argv.s || argv.script)
  process.exit(0)
}

startApp().catch((err) => logger.error(err))
