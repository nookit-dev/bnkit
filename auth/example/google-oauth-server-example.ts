import type { Routes } from "server";
import { serverFactory } from "server";
import { createOAuthHandler, googleProvider } from "../oauth";

const oauthHandler = createOAuthHandler(googleProvider);

const googleClientId = Bun.env.GOOGLE_OAUTH_CLIENT_ID || "";
const googleClientSecret = Bun.env.GOOGLE_OAUTH_CLIENT_SECRET || "";


console.log({
    googleClientId, 
    googleClientSecret
})

const routes = {
  "/login": {
    GET: (req) => {
      const authUrl = oauthHandler.initiateOAuthFlow({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectUri: "http://localhost:3000/callback",
      });
      return new Response(null, {
        headers: { Location: authUrl },
        status: 302,
      });
    },
  },
  "/callback": {
    GET: async (req) => {
      try {
        const host = req.headers.get("host")
        // Parse the URL and query parameters
        const url = new URL(req.url, `http://${host}`);
        const queryParams = new URLSearchParams(url.search);
        const code = queryParams.get("code");

        if (!code) {
          return new Response("No code provided in query", { status: 400 });
        }

        const tokenInfo = await oauthHandler.handleRedirect(code, {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          redirectUri: "http://localhost:3000/callback",
        });

        console.log({ tokenInfo });

        // Logic after successful authentication
        return new Response("Login Successful!");
      } catch (error) {
        console.error(error)
        return new Response("Authentication failed", { status: 500 });
      }
    },
  },
  "/": {
    GET: (req) => {
      // HTML content for the login page
      const htmlContent = `<html><body><h2>Login with Google</h2><button onclick="window.location.href='/login'">Login</button></body></html>`;
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    },
  },
} satisfies Routes;

const server = serverFactory({
  routes,
});

server.start()