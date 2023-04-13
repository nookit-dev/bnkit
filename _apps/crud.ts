import { ServerRoute, createCrudServer, createRouter } from "networking";

const config: ServerRoute[] = [
  {
    handler: (req) => {
      console.log(req);
      return new Response("Hello World");
    },
    method: "GET",
    path: "/",
  },
];

const router = createRouter(config);

const server = createCrudServer(router);


server.start()
