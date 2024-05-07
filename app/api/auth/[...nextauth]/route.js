import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak"


const keycloakOptions = {
  clientId: "poc-daeauth",
  clientSecret: "iHgdR11XImG8n0QUTAFqB4lE27hInTH0",
  issuer: "http://localhost:8080/realms/POC-DaeAuth",
}

const keycloak = KeycloakProvider(
  keycloakOptions
)

// this performs the final handshake for the keycloak
// provider, the way it's written could also potentially
// perform the action for other providers as well
async function doFinalSignoutHandshake(jwt) {
  const { provider, id_token } = jwt;
  console.log("doFinalSignoutHandshake", provider, id_token);

    try {
        // Add the id_token_hint to the query string
        const params = new URLSearchParams();
        params.append('id_token_hint', id_token);
        console.log("id_token_hint", id_token);
        const { status, statusText } = await fetch(`http://localhost:8080/realms/POC-DaeAuth/protocol/openid-connect/logout?${params.toString()}`);

        // The response body should contain a confirmation that the user has been logged out
        console.log("Completed post-logout handshake", status, statusText);
    }
    catch (e) {
        console.error("Unable to perform post-logout handshake", (e)?.code || e)
    }
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const data = new URLSearchParams({
      client_id: keycloakOptions.clientId,
      client_secret: keycloakOptions.clientSecret,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    const url = "http://localhost:8080/realms/POC-DaeAuth/protocol/openid-connect/token";
      

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: data,
    })

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens
    }

    token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000
    token.accessToken = refreshedTokens.access_token
    token.refreshToken = refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token

    return token;
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions = {
  providers: [
    keycloak
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
        if (account) {
            // copy the expiry from the original keycloak token
            // overrides the settings in NextAuth.session
            token.id_token = account.id_token;
            token.accessTokenExpires = account.expires_at * 1000;
            token.refreshToken = account.refresh_token;
            token.accessToken = account.access_token;
        }

        if (Date.now() < token.accessTokenExpires-60000) {
            return token;
        }

        return refreshAccessToken(token);
    }, 
    session: async ({ session, token }) => {
        // copy the expiry from the original keycloak token
        // overrides the settings in NextAuth.session
        if(token) {
          session.exp = token.accessTokenExpires;
          console.log("TOKEN EXPIRES: ", new Date(token.accessTokenExpires));
          session.id_token = token.id_token;
          session.accessToken = token.accessToken;
          session.error = token.error;
        }
        return session;
      }
  },
  events: {
      signOut: ({ session, token }) => {
        console.log("signOut", session, token);
        return doFinalSignoutHandshake(token);
      }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }