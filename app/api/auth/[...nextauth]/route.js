import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak"

const keycloak = KeycloakProvider({
  clientId: "poc-daeauth",
  clientSecret: "eVs2sXciJnTpXgEnP2DFOgv3GlKtImns",
  issuer: "http://localhost:8080/realms/POC-DaeAuth",
})

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

export const authOptions = {
  providers: [
    keycloak
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
        if (account) {
            // copy the expiry from the original keycloak token
            // overrides the settings in NextAuth.session
            token.exp = account.expires_at;
            token.id_token = account.id_token;
        }

        return token;
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