import NextAuth from "next-auth";
// utils/next-auth-options.ts から next-auth の設定を利用します。
import { nextAuthOptions } from "@/app/utils/next-auth-options";

// next-auth の設定を元に、NextAuth を初期化します。
const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };