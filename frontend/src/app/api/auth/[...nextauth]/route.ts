// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface CustomUser extends NextAuthUser {
  _id?: string;
  accessToken?: string; // To hold the backend JWT
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) { return null; }

        const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendApiUrl) { throw new Error("API URL not configured"); }

        try {
          const res = await fetch(`${backendApiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const loginResponse = await res.json();

          if (!res.ok || !loginResponse.success || !loginResponse.token) { // Check for token
            throw new Error(loginResponse.message || "Invalid credentials");
          }

          const user = loginResponse.data; // { _id, name, email }
          const accessToken = loginResponse.token; // <<< Get backend JWT

          if (user && accessToken) {
            // Return user data AND the backend token
            return {
              id: user._id,
              _id: user._id,
              name: user.name,
              email: user.email,
              accessToken: accessToken, // <<< Pass token to jwt callback
            };
          } else {
            return null;
          }
        } catch (error: any) {
          console.error("Error during authorization:", error);
          throw new Error(error.message || "Authentication failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: CustomUser }): Promise<JWT> {
      // Persist accessToken and user details to the NextAuth token
      if (user) {
        token.id = user.id;
        token._id = user._id;
        token.name = user.name;
        token.accessToken = user.accessToken; // <<< Store backend token here
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // Add user details and accessToken to the session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string; // <<< Expose backend token here
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
