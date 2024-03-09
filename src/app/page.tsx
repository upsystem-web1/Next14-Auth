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
