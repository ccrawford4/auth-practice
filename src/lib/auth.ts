import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
// import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Google({
    //   clientId: process.env.GOOGLE_ID as string,
    //   clientSecret: process.env.GOOGLE_SECRET as string
    // }),
    // Guest provider using Credentials
    CredentialsProvider({
      name: "Guest",
      credentials: {},
      async authorize() {
        // Automatically sign in as a guest user
        const user = { id: "guest", name: "Guest User", email: "guest@example.com" };
        return user; // Return the guest user object
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};