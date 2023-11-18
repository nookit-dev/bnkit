import { OAuthConfig, OAuthProviderFn } from "./oauth-types";

export type ProvidersConfig = Record<
  string,
  Omit<OAuthConfig, "clientId" | "clientSecret">
>;

export const bnkProviders = {
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
} satisfies ProvidersConfig;

export const initGoogleOAuth: OAuthProviderFn = (
  { clientId, clientSecret },
  options
) => {
  const redirectUrl = options?.redirectUrl;
  return {
    ...bnkProviders.google,
    redirectUri: redirectUrl ? redirectUrl : bnkProviders.google.redirectUri,
    clientId,
    clientSecret,
  };
};
