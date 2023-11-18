import { OAuthConfig, OAuthProviderFn } from "./oauth-types";

export type ProvidersConfigRecord = Record<
  string,
  Omit<OAuthConfig, "clientId" | "clientSecret">
>;

export const oAuthProviders = {
  google: {
    redirectUri: "http://localhost:3000/callback", // just a default placeholder
    authReqUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
  },
  microsoft: {
    redirectUri: "http://localhost:3000/callback",
    authReqUrl:
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "http://needtofind",
  },
} satisfies ProvidersConfigRecord;

export const initGoogleOAuth: OAuthProviderFn = (
  { clientId, clientSecret },
  options
) => {
  const redirectUrl = options?.redirectUrl;
  return {
    ...oAuthProviders.google,
    redirectUri: redirectUrl ? redirectUrl : oAuthProviders.google.redirectUri,
    clientId,
    clientSecret,
  };
};
