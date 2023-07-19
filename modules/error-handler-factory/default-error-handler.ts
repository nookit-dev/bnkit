import { type BaseError } from '../base-error'
import { defaultLogger } from '../logger-factory/default-logger'

import { createErrorHandlerFactory } from './create-error-handler-factory'

export const defaultErrorHandler = <
	DataType,
	Error extends BaseError<DataType>,
>() => {
	return createErrorHandlerFactory<DataType, Error>(defaultLogger)
}
