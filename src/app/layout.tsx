import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

//next-auth/next から getServerSession をインポートして、サーバーサイドでセッション情報を取得できるようにします。
import { getServerSession } from "next-auth/next";
// next-auth/react から useSession をインポートして、クライアントサイドでセッション情報を取得できるようにします。
import NextAuthProvider from "@/app/providers";
// utils/next-auth-options.ts から nextAuthOptions をインポートして、next-auth の設定を利用します。
import { nextAuthOptions } from "@/app/utils/next-auth-options";

import Header from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-Auth Example",
  description: "Next-Auth Example",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthOptions);

  return (
    <html lang="ja">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header session={session} />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
