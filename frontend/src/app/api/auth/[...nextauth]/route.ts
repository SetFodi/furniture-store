// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// 1. Add 'role' to CustomUser interface
interface CustomUser extends NextAuthUser {
  _id?: string;
  accessToken?: string; // To hold the backend JWT
  role?: string;        // <<< Add role field
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

          if (!res.ok || !loginResponse.success || !loginResponse.token) {
            throw new Error(loginResponse.message || "Invalid credentials");
          }

          // 2. Ensure backend login response includes 'role' in loginResponse.data
          const user = loginResponse.data; // Expect { _id, name, email, role }
          const accessToken = loginResponse.token;

          if (user && accessToken) {
            // 3. Return 'role' in the user object
            return {
              id: user._id,
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role, // <<< Pass role from backend data
              accessToken: accessToken,
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
      // 4. Persist 'role' to the JWT token
      if (user) {
        token.id = user.id;
        token._id = user._id;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.role = user.role; // <<< Store role in token
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // 5. Add 'role' to the session object from the token
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string; // <<< Add role to session user
        session.accessToken = token.accessToken as string;
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
