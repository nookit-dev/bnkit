// create http server  which will return webpages but prebuilt

const PORT = 3000;

const baseUrl = "http://localhost:3000";

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { url } = req;

    const urlObject = new URL(url);

    const pathname = urlObject.pathname;

    if (pathname === "/webpage") {
      return new Response(`<!DOCTYPE html><html><body>test</body></html>`, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response(`404!`);
  },
});
