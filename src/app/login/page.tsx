"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
    const handleSignInFlow = (provider: string) => {
        console.log("Sign in with: ", provider);
        signIn(provider, { callbackUrl: "/" });
    };
    return (
        <div>
        <button
            onClick={() => handleSignInFlow("github")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >Sign in
          </button>
        </div>
    )
}