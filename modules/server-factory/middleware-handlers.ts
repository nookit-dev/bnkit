import {
  CORSOptions,
  Middleware,
  MiddlewareNext,
  RouteHandler,
} from "../utils/http-types";
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

export function composeMiddlewares<TContext extends object>(
  middlewares: Middleware<TContext>[],
  handler: RouteHandler
): RouteHandler {
  return (request: Request) => {
    const invokeNext: MiddlewareNext<TContext> = (context) => {
      return handler(request);
    };

    const finalMiddleware = middlewares.reduceRight<Middleware<TContext>>(
      (nextMiddleware, currentMiddleware) => {
        return ({ request, context }) => {
          return currentMiddleware({
            request,
            context,
            next: (updatedContext = context) => {
              return nextMiddleware({
                request,
                context: updatedContext,
                next: invokeNext,
              });
            },
          });
        };
      },
      ({ request, context }) => invokeNext(context)
    );

    return finalMiddleware({
      request,
      context: undefined,
      next: invokeNext,
    });
  };
}
