import { CORSOptions, Middleware, RouteHandler } from "../utils/http-types";
import { bodyParser } from "./body-parser-middleware";
import { checkFileSizeMiddleware } from "./check-file-size-middleware";
import { createCorsMiddleware } from "./create-cors-middleware";

export function generateMiddlewares<MiddlewareCtx extends object = {}>({
  cors,
  enableBodyParser,
  maxFileSize,
}: {
  cors?: CORSOptions;
  enableBodyParser?: boolean;
  maxFileSize?: number;
}): Middleware<MiddlewareCtx>[] {
  let middlewares: Middleware<MiddlewareCtx>[] = [];

  if (cors) {
    middlewares.push(createCorsMiddleware(cors));
  }
  if (enableBodyParser) {
    middlewares.push(bodyParser);
  }
  if (maxFileSize) {
    middlewares.push(checkFileSizeMiddleware(maxFileSize));
  }

  return middlewares;
}

export function composeMiddlewares<CtxT extends object = {}>(
  middlewares: Middleware<CtxT>[],
  handler: RouteHandler,
  response: Response
): RouteHandler {
  return (request: Request) => {
    let context: CtxT = {} as CtxT; // Default context

    const invokeNext = async (index: number): Promise<Response> => {
      if (index >= middlewares.length) {
        return handler(request);
      }
      const middleware = middlewares[index];
      return middleware({
        request,
        context,
        response,
        next: () => {
          return invokeNext(index + 1);
        },
      });
    };

    return invokeNext(0); // Start with the first middleware
  };
}
