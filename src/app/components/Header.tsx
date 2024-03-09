"use client";
import Image from "next/image";
import Link from "next/link";
// next-auth の Session 型をインポートして、セッション情報の型定義を利用します。
import { type Session } from "next-auth";
// next-auth/react から signOut 関数をインポートして、ユーザーがログアウトできるようにします。
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
              {/* ユーザーのプロファイルページへのリンク。プロファイル画像をクリックすると、プロファイルページに遷移します。 */}
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
              {/* ログアウトボタン。クリックするとユーザーがログアウトされます。 */}
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
            {/* ログインしていない場合、ログインページへのリンクを表示します。 */}
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
