import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions, User } from "next-auth";
import { db } from "./db";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbuser = (await db.get(`user:${token.id}`)) as User | null;

      if (!dbuser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbuser.id,
        name: dbuser.name,
        email: dbuser.email,
        picture: dbuser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.name = token.name),
          (session.user.image = token.picture),
          (session.user.email = token.email);
      }

      return session;
    },
  },
};
 