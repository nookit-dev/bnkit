import { fileFactory } from '../files-folders'
import type { defaultLogger } from '../logger'
import type { BaseError } from '../utils/base-error'
import { chooseActions, getAdditionalPrompt, getUserInput, parseCliArgs } from './cli-utils'

export type CLIOptions = {
  inputPrompt?: string
  actionsConfig?: Record<string, any>
  logger?: typeof defaultLogger
  // fileConfig?: {
  //   filePath: string;
  //   fileContent: string;
  // };
}

export function createCliFactory<DataT, E extends BaseError<DataT>>({
  inputPrompt = 'Please input your command',
  actionsConfig = {},

  logger,
}: CLIOptions) {
  // const actionsConfig = options.actionsConfig ?? {};
  const factory = fileFactory({
    baseDirectory: '.', // Replace with actual path
  })

  const processInput = async () => {
    const commandLineArgs = await parseCliArgs()

    const userInput = await getUserInput()

    // Handle user input and command line arguments...
    return { commandLineArgs, userInput }
  }

  const executeActions = async () => {
    const additionalPrompt = await getAdditionalPrompt()

    const chosenActions = await chooseActions(actionsConfig)

    // Execute chosen actions...

    return { additionalPrompt, chosenActions }
  }

  const handleFiles = ({ filePath, fileContent }: { filePath: string; fileContent: string }) => {
    factory.directoryExists({ path: filePath })

    factory.createFile(filePath, fileContent)
  }

  return {
    inputPrompt,
    processInput,
    executeActions,
    handleFiles,
  }
}
