import readline from 'readline'

const cliLog = (...args: any[]) => {
  console.info(...args)
}

// Get user input asynchronously
export async function getUserInput(): Promise<string> {
  const proc = Bun.spawn([])
  return await new Response(proc.stdout).text()
}

// Interface for parsed command line arguments
export interface ParsedArgs {
  [key: string]: string | boolean | undefined
}

export interface OptionDefinition {
  default?: string | boolean
  types: (string | boolean)[]
}

const optionDefinitions: { [key: string]: OptionDefinition } = {
  // Define available options here
}

// Parse command line arguments
export function getArguments(): string[] {
  return process.argv.slice(2)
}

export function getOptionValue(
  arg: string,
  nextArg: string,
  optionDef: OptionDefinition
): string | boolean | undefined {
  let value = optionDef.default

  if (nextArg && !nextArg.startsWith('--')) {
    const type = optionDef.types.find((type) => type === typeof nextArg || type === typeof value)
    cliLog('Type found: ', type) // Debug log
    if (type === 'boolean') {
      if (nextArg.toLowerCase() === 'true') {
        value = true
      } else if (nextArg.toLowerCase() === 'false') {
        value = false
      }
    } else {
      value = nextArg
    }
  } else if (typeof value === 'boolean') {
    value = true
  }

  cliLog('Returned value: ', value) // Debug log
  return value
}

export function parseArgument(
  arg: string,
  nextArg: string
): { key: string | undefined; value: string | boolean | undefined } {
  let key: string | undefined = undefined
  let value: string | boolean | undefined

  if (arg.startsWith('--')) {
    key = arg.slice(2)
    if (optionDefinitions.hasOwnProperty(key)) {
      const optionDef = optionDefinitions[key]
      value = getOptionValue(arg, nextArg, optionDef)
    } else {
      value = true
    }
  } else {
    throw new Error(`Invalid parameter: ${arg}`)
  }

  return { key, value }
}

export async function parseCliArgs(): Promise<ParsedArgs> {
  const args = getArguments()
  const parsedArgs: ParsedArgs = {}

  for (let i = 0; i < args.length; i++) {
    const { key, value } = parseArgument(args[i], args[i + 1])

    if (key) {
      parsedArgs[key] = value
    }
  }

  return parsedArgs
}

export const getAdditionalPrompt = () =>
  new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Do you want to add anything else...', (additionalPrompt) => {
      rl.close()
      resolve(additionalPrompt)
    })
  })

export const chooseActions = async (actionsConfig: Record<string, any>): Promise<Array<keyof typeof actionsConfig>> => {
  cliLog('\nChoose actions (separated by commas):')
  const actions = Object.keys(actionsConfig)

  actions.forEach((action, index) => {
    cliLog(`${index + 1}. ${action}`)
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const actionIndexes = await new Promise<string>((resolve) => {
    rl.question('Enter the numbers corresponding to the actions: ', (actionIndexes) => {
      rl.close()
      resolve(actionIndexes)
    })
  })

  const selectedIndexes = actionIndexes.split(',').map((index) => Number.parseInt(index.trim()) - 1)

  const validSelection = selectedIndexes.every((index) => index >= 0 && index < actions.length)

  if (validSelection) {
    return selectedIndexes.map((index) => actions[index] as keyof typeof actionsConfig)
  }

  cliLog('Invalid input, please try again.')
  return chooseActions(actionsConfig)
}
