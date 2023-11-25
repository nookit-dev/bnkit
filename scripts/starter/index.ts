import { jsonRes, serverFactory } from "bnkit/server";
import { middleware, RoutesWithMiddleware } from "./middlewares";

const routes = {
  "/": {
    GET: (_, { time }) => {
      return new Response(`Hello World! ${time?.timestamp.toISOString()}`);
    },
  },
  "/json": {
    GET: (_, { time }) =>
      jsonRes({
        message: "Hello JSON Response!",
        ...time,
      }),
  },
} satisfies RoutesWithMiddleware;

// Create Server Factory with middleware
const { start } = serverFactory({
  routes,
  middleware,
});

start();
