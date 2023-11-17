// export const initGoogleOAuth = ({
//     clientId,
//     clientSecret,
//   }: OAuthProviderCreds): OAuthConfig => {
//     return {
//       clientId,
//       clientSecret,
//       redirectUri: "http://localhost:3000/callback",
//       authReqUrl: "https://accounts.google.com/o/oauth2/v2/auth",
//       tokenUrl: "https://oauth2.googleapis.com/token",
//     };
//   };


// todo update to the above API
  export const createMicrosoftProvider = (
  config: Omit<OAuthConfig, "authReqUrl">
): OAuthHelpers => {
  return {
    getAuthorizationUrl: (config) => {
      const microsoftAuthUrl =
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
      const queryParams = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "email profile",
      });

      return `${microsoftAuthUrl}?${queryParams.toString()}`;
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