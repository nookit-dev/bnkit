import { htmlRes, serverFactory } from "../server";
import { pageGenerator } from "./html-factory";

import { htmlBody } from "./page-confg";

const pageGen = pageGenerator(
  { title: "My Title" },
  {
    useHtmx: true,
  }
);

const renderedPage = pageGen.buildHtml(htmlBody);

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
