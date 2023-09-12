import { CORSOptions, Middleware } from "../utils/http-types";
import { bodyParser } from "./body-parser-middleware";
import { checkFileSizeMiddleware } from "./check-file-size-middleware";
import { createCorsMiddleware } from "./create-cors-middleware";

export function generateMiddlewares({
  cors,
  enableBodyParser,
  maxFileSize
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