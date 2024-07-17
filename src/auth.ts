import NextAuth, { DefaultSession, Session } from "next-auth"; // Import NextAuth and types
import Spotify from "next-auth/providers/spotify"; // Import the Spotify provider

// Function to refresh the access token using the refresh token
async function refreshAccessToken(token: any) {
  console.log("Refreshing access token...");

  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: process.env.AUTH_SPOTIFY_ID as string,
      client_secret: process.env.AUTH_SPOTIFY_SECRET as string,
    });

    const url = `https://accounts.spotify.com/api/token?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }
    console.log("Refreshed token response:", refreshedTokens);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Export the handlers, signIn, signOut, and auth methods from NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=ugc-image-upload user-read-recently-played user-top-read user-read-playback-position user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-library-modify user-library-read user-read-email user-read-private",
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        console.log("New account data:", account);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires =
          Date.now() + (account.expires_in as number) * 1000;
        token.user = user;
      }
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = { ...token.user, ...session.user };
      return {
        ...session,
        token,
      };
    },
  },
});

// Extending the next-auth module to add custom types
declare module "next-auth" {
  interface User {}

  interface Account {}

  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    refreshToken?: string;
  }
}

// Importing the JWT interface from next-auth/jwt
import { JWT as NextAuthJWT } from "next-auth/jwt";

// Extending the next-auth/jwt module to add custom types
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user?: Session["user"];
  }
}
