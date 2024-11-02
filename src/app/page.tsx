"use client";

// import ScaleLoader from "react-spinners/ScaleLoader";
import React /* { memo }*/ from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Wrap ScaleLoader with React.memo
// const MemoizedScaleLoader = memo(ScaleLoader);

export default function Home() {
  const { data: session } = useSession();
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
    if (!session) {
      console.log("Not logged in. Redirecting to login page...");
      router.push("/login");
    }
  });

  return (
    <div className="h-screen flex items-center justify-center">
      Welcome to the home page {getFirstName(session?.user?.name)}!
    </div>
  );
}