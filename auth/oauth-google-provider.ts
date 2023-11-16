import { OAuthProvider, OAuthToken } from "./oauth-types";

export const googleProvider: OAuthProvider = {
  getAuthorizationUrl: (config) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const queryParams = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: "email profile",
    });
    return `${baseUrl}?${queryParams.toString()}`;
  },
  getToken: async (code, config) => {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token`);
    }

    const tokenInfo: OAuthToken = await response.json();
    return tokenInfo;
  },
};
