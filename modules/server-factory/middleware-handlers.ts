import { CORSOptions, Middleware, RouteHandler } from "../utils/http-types";
import { bodyParser } from "./body-parser-middleware";
import { checkFileSizeMiddleware } from "./check-file-size-middleware";
import { createCorsMiddleware } from "./create-cors-middleware";

export function generateMiddlewares({
  cors,
  enableBodyParser,
  maxFileSize,
}: {
  cors?: CORSOptions;
  enableBodyParser?: boolean;
  maxFileSize?: number;
}): Middleware[] {
  let middlewares: Middleware[] = [];

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

export function composeMiddlewares(
  middlewares: Middleware[],
  handler: RouteHandler
): RouteHandler {
  return (request: Request) => {
    const invokeHandler: Middleware = (req, next) => handler(req);

    const finalMiddleware = middlewares.reduceRight(
      (nextMiddleware: Middleware, currentMiddleware: Middleware) => {
        return (currentRequest: Request) => {
          return currentMiddleware(currentRequest, () =>
            nextMiddleware(currentRequest, () => handler(request))
          );
        };
      },
      invokeHandler
    );

    return finalMiddleware(request, () => handler(request));
  };
}
