import {
  OAuthConfig,
  OAuthProviderInitializer,
  OAuthToken,
} from "./oauth-types";

type FetcherResponse<T> = T & {
  error?: string;
};

// Generic OAuth fetcher
export async function oAuthFetcher<T>(
  url: string,
  params: Record<string, string | undefined>
): Promise<FetcherResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });

  return response.json();
}

// Wrapper function for getting token
export async function getOAuthToken<T extends OAuthToken>({
  code,
  config,
}: {
  code: string;
  config: Omit<OAuthConfig, "authReqUrl">;
}): Promise<FetcherResponse<T>> {
  const params = {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  };

  return oAuthFetcher<T>(config.tokenUrl, params);
}

export const createOAuthFactory = (config: OAuthConfig) => {
  const provider = initProvider(config);

  return {
    handleRedirect: async (code: string) => {
      return await provider.getToken(code, config);
    },
    initiateOAuthFlow: () => {
      return provider.getAuthorizationUrl(config);
    },
  };
};

export const initProvider: OAuthProviderInitializer = (config) => {
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
