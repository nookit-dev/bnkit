import { initProvider } from "./oauth-google-provider";
import { OAuthConfig, OAuthToken } from "./oauth-types";

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
