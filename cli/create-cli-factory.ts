import { fileFactory } from '../files-folders'
import { defaultLogger } from '../logger'
import { BaseError } from '../utils/base-error'
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
    try {
      const commandLineArgs = await parseCliArgs()

      const userInput = await getUserInput()

      // Handle user input and command line arguments...
      return { commandLineArgs, userInput }
    } catch (error) {
      throw error
    }
  }

  const executeActions = async () => {
    try {
      const additionalPrompt = await getAdditionalPrompt()

      const chosenActions = await chooseActions(actionsConfig)

      // Execute chosen actions...

      return { additionalPrompt, chosenActions }
    } catch (error) {
      throw error
    }
  }

  const handleFiles = ({ filePath, fileContent }: { filePath: string; fileContent: string }) => {
    try {
      factory.directoryExists({ path: filePath })

      factory.createFile(filePath, fileContent)
    } catch (error) {
      throw error
    }
  }

  return {
    inputPrompt,
    processInput,
    executeActions,
    handleFiles,
  }
}
