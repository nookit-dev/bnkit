import { clientLogger } from "../logger-factory/client-logger";
import {
  errorCodeMap,
  type ErrorCodes,
  type createLoggerFactory,
} from "../logger-factory/create-logger-factory";
import { BaseError } from "../utils/base-error";

export type CallerFunctionAsync<OverrideDataType> =
  () => Promise<OverrideDataType>;
export type CallerFunctionSync<OverrideDataType> = () => OverrideDataType;

export function createErrorHandlerFactory<
  DataType,
  E extends BaseError<DataType>
>({
  defaultValue = null,
  logger = clientLogger,
}: {
  defaultValue?: DataType | null;
  logger?: ReturnType<typeof createLoggerFactory>;
}) {
  return {
    handleAsync: async <OverrideDataType = DataType>(
      caller: CallerFunctionAsync<OverrideDataType>
    ): Promise<OverrideDataType> => {
      try {
        return await caller();
      } catch (error) {
        if (error instanceof BaseError) {
          const customError: E = error;
          const errorCode: ErrorCodes = errorCodeMap[
            customError.name as ErrorCodes
          ] as ErrorCodes;

          logger?.error(
            customError.message,
            customError.data, // Custom data is logged here
            errorCode
          );
        }
        return defaultValue as unknown as OverrideDataType;
      }
    },

    handleSync: <OverrideDataType = DataType>(
      caller: CallerFunctionSync<OverrideDataType>
    ): OverrideDataType => {
      try {
        return caller();
      } catch (error) {
        if (error instanceof BaseError) {
          const customError: E = error;

          const errorCode: ErrorCodes = errorCodeMap[
            customError.name as ErrorCodes
          ] as ErrorCodes;

          logger?.error(
            customError.message,
            customError.data, // Custom data is logged here
            errorCode
          );
        }
        return defaultValue  as unknown as OverrideDataType;
      }
    },
  };
}
