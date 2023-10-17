import { renderToReadableStream } from "react-dom/server";
import {
  RouteHandler,
} from "../../modules/server";

export const createReactStreamHandler = async ({
  renderNode,
}: {
  renderNode: React.ReactNode;
}) => {
  const reactDomStreamHandler: RouteHandler<any> = async (req) => {
    const stream = await renderToReadableStream(renderNode, {
      bootstrapScripts: ["./build/base.js"],
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  };

  return reactDomStreamHandler;
};
