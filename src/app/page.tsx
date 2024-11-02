"use client";

// import ScaleLoader from "react-spinners/ScaleLoader";
import React /* { memo }*/ from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

// Wrap ScaleLoader with React.memo
// const MemoizedScaleLoader = memo(ScaleLoader);

export default function Home() {
  const { data: session } = useSession();

  const handleSignInFlow = (provider: string) => {
    console.log("Sign in with: ", provider);
    signIn(provider, { callbackUrl: "/" });
  };

  const getFirstName = (name: string | null | undefined) => {
    if (!name) {
        return "";
    }
    if (name.split(" ").length > 1) {
        return name.split(" ")[0];
    }
    return "";
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {session ? (
        <>
          Welcome {getFirstName(session.user?.name)}!
        </>
      ) : (
        <>
          Not Logged In
          <button
            onClick={() => handleSignInFlow("github")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >Sign in
          </button>
        </>
      )}
    </div>
  );
}