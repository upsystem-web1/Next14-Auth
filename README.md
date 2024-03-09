# Next14でNextAuth使用サンプル

このプロジェクトはNext14でNextAuthを利用する方法を示すサンプルコードです。Google認証を例に、セッション管理を実装しています。

## 技術スタック

- Next.js 14
- NextAuth.js
- React

## セットアップ方法

1. プロジェクトのクローン

    ```
    git clone <プロジェクトのURL>
    ```

2. 依存関係のインストール

    ```
    npm install
    ```

3. 環境変数の設定

    プロジェクトのルートに `.env.local` ファイルを作成し、以下の内容を追加します。

    ```
    GOOGLE_CLIENT_ID=<あなたのGoogleクライアントID>
    GOOGLE_CLIENT_SECRET=<あなたのGoogleクライアントシークレット>
    ```

4. プロジェクトの起動

    ```
    npm run dev
    ```

## 主要ファイルとコンポーネント

### `Layout.tsx`

アプリケーションのレイアウトを定義します。セッション情報をサーバーサイドで取得し、全ページで利用できるようにします。

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import NextAuthProvider from "@/app/providers";
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
```

### `Layout.tsx`

ホームページを定義します。セッション情報をクライアントサイドで取得します。

```tsx
import NextAuthProvider from "@/app/providers";
import SessionSection from "@/app/components/SessionSection";
import { nextAuthOptions } from "@/app/utils/next-auth-options";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <NextAuthProvider>
        <SessionSection session={session} />
      </NextAuthProvider>
    </main>
  );
}
```


### `app/providers.tsx`

```markdown
NextAuthのセッションプロバイダーを定義します。これにより、アプリケーション全体でセッション情報が利用できるようになります。

```tsx
"use client";

import { type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### `app/utils/next-auth-options.ts`

```markdown
NextAuthの設定を定義します。Google認証を使用する例です。

```tsx
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  debug: false,
  session: { strategy: "jwt" },
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
```

### `app/api/auth[...nextauth]/route.ts`

NextAuthの設定を利用して、NextAuthを初期化します。

```tsx
import NextAuth from "next-auth";
import { nextAuthOptions } from "@/app/utils/next-auth-options";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
```


### `app/components/Header.tsx`

```markdown
ヘッダーコンポーネントを定義します。セッション情報に基づいて、ユーザー名の表示やログアウトボタンを条件付きで表示します。

```tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

const Header = ({ session }: { session: Session | null }) => {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-4xl font-bold">
          HOME
        </Link>
      </div>
      <ul className="flex items-center space-x-4">
        {session ? (
          <>
            <li>
              <Link href="/profile">
                <Image
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="bg-red-600 px-4 py-[7px] text-white hover:bg-red-700"
              >
                ログアウト
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">
              <button className="bg-black px-4 py-[7px] text-white hover:bg-gray-800">
                ログイン
              </button>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;

```


### `app/login/page.tsx`

```markdown
ログインページを定義します。useSessionフックを使用してセッションの状態をチェックし、すでに認証されている場合はホームページにリダイレクトします。

```tsx
"use client";

import React from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [session, status]);

  const handleLogin = (provider: string) => async (event: React.MouseEvent) => {
    event.preventDefault();
    const result = await signIn(provider);
    if (result) {
      redirect("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="w-full max-w-xs">
        <button
          onClick={handleLogin("google")}
          type="button"
          className="w-full bg-red-500 text-white px-4 py-2"
        >
          Googleでログイン
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

```


### `app/profile/page.tsx`

```markdown
プロファイルページを定義します。useSessionフックを使用してセッション情報を取得し、ユーザーのプロファイル情報を表示します。

```tsx
"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { NextPage } from "next";

const Profile: NextPage = () => {
  const { data: session } = useSession({ required: true });

  return (
    <div className="flex items-center justify-center min-h-screen">
      {session && (
        <div className="flex flex-col items-center space-y-4">
          {session.user?.image && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={session.user?.image}
                alt=""
                width={96}
                height={96}
              />
            </div>
          )}
          <div className="text-2xl font-bold">{session.user?.name}</div>
          <div className="text-lg">{session.user?.email}</div>
        </div>
      )}
      {!session && (
        <div className="text-center">
          <p>ログインしてください</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

```


### `app/components/SessionSection.tsx`

```markdown
セッション情報に基づいて、ユーザーへの歓迎メッセージまたはログインプロンプトを表示するコンポーネントを定義します。

```tsx
import React from "react";
import { type Session } from "next-auth";

const SessionSection = ({ session }: { session: Session | null }) => {
  return (
    <div className="text-center">
      {session ? (
        <div className="text-center">
          <h1 className="text-4xl mb-4">ようこそ、{session?.user?.name}さん</h1>
          <p className="text-lg">
            あなたは{session?.user?.email}でログインしています
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl">ようこそ、ゲストさん</h1>
          <p className="text-lg">ログインしてください</p>
        </div>
      )}
    </div>
  );
};

export default SessionSection;

```

## 結論

このサンプルプロジェクトは、Next14でNextAuthを使用してセッション管理を実装する方法を示しています。Google認証を例に、Next.jsアプリケーションにおける認証フローの設定と管理をどのように行うかについての具体的な例を提供しています。

このプロジェクトを通じて、NextAuthの基本的な設定から、セッション情報の取得、認証プロバイダーの設定、クライアントサイドとサーバーサイドでのセッションの利用方法まで、NextAuthを使用した認証システムの実装方法を理解することができます。

サンプルコードを自身のプロジェクトに適用することで、Next.jsアプリケーションにおけるユーザー認証機能の追加とセッション管理を効率的に行うことが可能です。Next.jsとNextAuthを使用したセキュアなウェブアプリケーションの開発に役立ててください。




