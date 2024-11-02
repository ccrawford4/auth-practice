"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const getFirstName = (name: string | null | undefined) => {
    if (!name) {
        return "";
    }
    if (name.split(" ").length > 1) {
        return name.split(" ")[0];
    }
    return "";
  }

  React.useEffect(() => {
    console.log("Session: ", session);
    if (status === "unauthenticated") {
      console.log("Not logged in. Redirecting to login page...");
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      Welcome to the home page {getFirstName(session?.user?.name)}!
    </div>
  );
}