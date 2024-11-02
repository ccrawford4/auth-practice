"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(()=> {
        console.log("Session: ", session);
        if (status === "authenticated") {
            console.log("Already logged in. Redirecting to home page...");
            router.push("/");
        }
    }, [session, status, router]);


    if (status === "loading") {
        return <div>Loading...</div>;
    }


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