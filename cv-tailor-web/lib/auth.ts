import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Call backend login endpoint
          const response = await fetch(`${BACKEND_URL}/auth/login/json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          
          // Get user info with the token
          const userResponse = await fetch(`${BACKEND_URL}/auth/me`, {
            headers: {
              "Authorization": `Bearer ${data.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const user = await userResponse.json();

          // Return user object with token
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        (session.user as any).id = token.id;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes (match backend token expiry)
  },
  secret: process.env.NEXTAUTH_SECRET,
};
