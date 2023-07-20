import { defaultLogger } from '../logger-factory/default-logger'
import { type BaseError } from '../utils/base-error'

import { createErrorHandlerFactory } from './create-error-handler-factory'

export const defaultErrorHandler = <
	DataType,
	Error extends BaseError<DataType>,
>() => {
	return createErrorHandlerFactory<DataType, Error>(defaultLogger)
}
