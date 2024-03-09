import React from "react";
import { type Session } from "next-auth";

const SessionSection = ({ session }: { session: Session | null }) => {
  return (
    <div className="text-center">
      {session ? (
        <div className="text-center">
          <h1 className="text-4xl mb-4">ようこそ、{session?.user?.name}さん</h1>
          <p className="text-lg">
            あなたは{session?.user?.email}で ログインしています
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
