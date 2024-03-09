// Google認証プロバイダをインポートします。
import GoogleProvider from "next-auth/providers/google";

// next-auth の設定タイプをインポートします。
import type { NextAuthOptions } from "next-auth";

// next-auth の設定オブジェクトを定義します。
export const nextAuthOptions: NextAuthOptions = {
  // デバッグモードを有効にして、開発中にログを詳細に表示するか？を設定します。
  debug: false,

  // セッション管理の設定です。JWT方式を使用します。
  session: { strategy: "jwt" },

  // 認証プロバイダの設定です。ここではGoogleを使用します。
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
};
