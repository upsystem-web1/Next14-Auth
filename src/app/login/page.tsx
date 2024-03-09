"use client";

import React from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const LoginPage = () => {
  // useSession フックを使ってセッション情報を取得します。
  const { data: session, status } = useSession();

  useEffect(() => {
    // ログイン済みの場合はTOPページにリダイレクト
    if (status === "authenticated") {
      redirect("/");
    }
  }, [session, status]);

  const handleLogin = (provider: string) => async (event: React.MouseEvent) => {
    // ログインボタンがクリックされたときの処理です。
    event.preventDefault();
    // signIn 関数を使って、指定したプロバイダでログインします。
    const result = await signIn(provider);

    // ログインに成功したらTOPページにリダイレクト
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