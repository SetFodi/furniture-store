// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; // Import JWT type

// Define an interface extending NextAuthUser to include our custom fields like _id
interface CustomUser extends NextAuthUser {
  _id?: string; // Add _id from our backend user data
  // Add other custom fields if needed (e.g., role)
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<CustomUser | null> {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials?.password) {
          console.error("Credentials missing");
          return null; // Indicate failure
        }

        const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendApiUrl) {
          console.error("Backend API URL not configured for NextAuth");
          throw new Error("API URL not configured");
        }

        try {
          console.log("Attempting login via backend API...");
          const res = await fetch(`${backendApiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const loginResponse = await res.json();

          if (!res.ok || !loginResponse.success) {
            // Handle failed login attempts from backend
            console.error(
              "Backend login failed:",
              loginResponse.message || res.statusText
            );
            // Throw an error to display a message on the frontend sign-in page
            throw new Error(
              loginResponse.message || "Invalid credentials"
            );
          }

          // If login is successful, backend returns user data in loginResponse.data
          const user = loginResponse.data; // { _id, name, email }

          if (user) {
            console.log("Backend login successful for:", user.email);
            // Return the user object required by NextAuth
            // Map backend fields to NextAuth expected fields + custom fields
            return {
              id: user._id, // Use backend _id as NextAuth id
              _id: user._id, // Keep our _id as well
              name: user.name,
              email: user.email,
              // image: user.avatarUrl, // Add if you have user images
            };
          } else {
            // Should not happen if backend response is correct, but handle just in case
            console.error("Backend login succeeded but no user data returned");
            return null;
          }
        } catch (error: any) {
          console.error("Error during authorization:", error);
          // Rethrow the error so NextAuth can display it on the sign-in page
          throw new Error(
            error.message || "Authentication failed. Please try again."
          );
        }
      },
    }),
    // ...add more providers here later (Google, GitHub, etc.)
  ],

  // --- Session Strategy ---
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management (stateless)
    // maxAge: 30 * 24 * 60 * 60, // Optional: Session expiry (e.g., 30 days)
  },

  // --- Callbacks ---
  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed (e.g., sign in, session check).
  callbacks: {
    // The `jwt` callback is called whenever a JWT is created (i.e., sign in)
    // or updated (i.e., session accessed).
    async jwt({ token, user }: { token: JWT; user?: CustomUser }): Promise<JWT> {
      // Persist the user id (_id) and name to the token right after signin
      if (user) {
        token.id = user.id; // Corresponds to user._id from authorize
        token._id = user._id; // Keep our backend ID explicitly
        token.name = user.name;
        // Add other user properties like role if needed: token.role = user.role;
        console.log("JWT Callback - User Sign In:", user.email);
      }
      // console.log("JWT Callback - Token:", token); // Debugging
      return token; // The token will be stored in the session cookie
    },

    // The `session` callback is called whenever a session is checked
    // (e.g., `useSession`, `getSession`).
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // Send properties to the client, like user id and name from the token.
      if (token && session.user) {
        session.user.id = token.id as string; // Add id from token to session user
        session.user._id = token._id as string; // Add _id from token
        session.user.name = token.name as string; // Ensure name is passed
        // Add other properties like role: session.user.role = token.role;
      }
      // console.log("Session Callback - Session:", session); // Debugging
      return session; // The session object is returned to the client
    },
  },

  // --- Pages ---
  // Optional: Specify custom pages for sign-in, sign-out, error, etc.
  pages: {
    signIn: "/login", // Redirect users to /login if they need to sign in
    // signOut: '/auth/signout',
    error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email provider)
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // --- Secret ---
  // Ensure the NEXTAUTH_SECRET environment variable is set.
  secret: process.env.NEXTAUTH_SECRET,

  // --- Debugging ---
  // debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
};

// Export the handler initialized with the options
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Export handlers for GET and POST requests
