// src/app/api/auth/[...nextauth]/route.ts
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak"
export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: "poc-daeauth",
      clientSecret: "eVs2sXciJnTpXgEnP2DFOgv3GlKtImns",
      issuer: "http://localhost:8080/realms/POC-DaeAuth",
    })
  ]
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }