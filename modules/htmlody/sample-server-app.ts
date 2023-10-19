import { htmlRes, serverFactory } from "../server";
import { htmlFactory } from "./html-generator";

import { htmlBody } from "./page-confg";

export const pageFactory = htmlFactory({ title: "My Title" }, htmlBody, {
  pageTitle: "My Page",
  // tailwindConfig,
  useHtmx: true,
  useTailwind: true,
});



const renderedPage = pageFactory.getHtmlOut();

const server = serverFactory({
  serve: Bun.serve,
  routes: {
    "/": {
      GET: (req, res) => {
        // or for dynamic content, re-render on each request
        return htmlRes(renderedPage);
      },
    },
  },
});

server.start(3001);
