import { Routes, routeManager, serverFactory } from "@u-tools/core/modules/server";

const routes: Routes = {
  "/": {
    GET: (req) => {
      return new Response("Hello World!");
    },
  },
};

const router = routeManager(routes);

serverFactory({router,});




const createReactServer = ({}:{
    port: number,
}) => {
    return 
}