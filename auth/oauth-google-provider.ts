import { getOAuthToken } from "./oauth";
import { OAuthConfig, OAuthHelpers, OAuthToken } from "./oauth-types";

export type OAuthProviderCreds = Pick<OAuthConfig, "clientId" | "clientSecret">;

export const initGoogleOAuth = ({
  clientId,
  clientSecret,
}: OAuthProviderCreds): OAuthConfig => {
  return {
    clientId,
    clientSecret,
    redirectUri: "http://localhost:3000/callback",
    authReqUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
  };
};

export const initProvider = (config: OAuthConfig): OAuthHelpers => {
  return {
    // TODO add options to be able to change response_type/scope, etc
    getAuthorizationUrl: (config) => {
      const authUrl = config.authReqUrl;
      const queryParams = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "email profile",
      });

      return `${authUrl}?${queryParams.toString()}`;
    },
    getToken: async (code: string) => {
      return getOAuthToken<OAuthToken>({ code, config }).then((response) => {
        if (response.error) {
          console.error("Error fetching token:", response.error);
          throw new Error(response.error);
        } else {
          console.log("Access Token:", response.accessToken);
          return response;
        }
      });
    },
  };
};
