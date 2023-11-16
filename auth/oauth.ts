// OAuth types
interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  // Additional provider-specific fields
}

interface OAuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // Time in seconds after which the token expires
  refreshToken?: string; // Optional, not all flows return a refresh token
  scope?: string; // Optional, scope of the access granted
  idToken?: string; // Optional, used in OpenID Connect (OIDC)
  // Additional fields can be added here depending on the OAuth provider
}

interface OAuthProvider {
  getAuthorizationUrl(config: OAuthConfig): string;
  getToken(code: string, config: OAuthConfig): Promise<OAuthToken>; // Simplified for demonstration
  
}

export const createOAuthHandler = (provider: OAuthProvider) => {
  const initiateOAuthFlow = (config: OAuthConfig) => {
    return provider.getAuthorizationUrl(config);
  };

  const handleRedirect = async (code: string, config: OAuthConfig) => {
    return await provider.getToken(code, config);
  };

  return {
    initiateOAuthFlow,
    handleRedirect,
  };
};

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

    console.log({ response });

    if (!response.ok) {
      throw new Error(`Failed to fetch token`);
    }

    const tokenInfo: OAuthToken = await response.json();
    return tokenInfo;
  },

};

