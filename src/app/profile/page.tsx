"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { NextPage } from "next";

const Profile: NextPage = () => {
  // sessionには、以下のような値が入っています。
  // {
  //     "user":{
  //        "name":"Taro Yamada",
  //        "email":"taro@examle.com",
  //        "image":"https://lh3.googleusercontent.com/a/AGNmyxZF7jQN_YTYVyxIx5kfdo3kalfRktVD17GrZ9n=s96-c"
  //     },
  //     "expires":"2023-04-01T00:29:51.016Z"
  // }
  const { data: session } = useSession({ required: true });

  return (
    <div className="flex items-center justify-center min-h-screen">
      {
        // セッションがある場合は、プロファイルを表示する
        session && (
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
        )
      }
      {
        // セッションがない場合は、ログインページに遷移する
        !session && (
          <div className="text-center">
            <p>ログインしてください</p>
          </div>
        )
      }
    </div>
  );
};

export default Profile;
