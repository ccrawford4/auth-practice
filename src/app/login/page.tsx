"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State to handle the tenant input and validation
  const [tenant, setTenant] = useState("");
  const [tenantValidated, setTenantValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Session: ", session);
    if (status === "authenticated") {
      console.log("Already logged in. Redirecting to home page...");
      router.push("/");
    }
  }, [status, session, router]);

  // Function to handle tenant name validation
  const handleTenantSubmit = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/login/" + tenant;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await response.json();

      console.log("Body: ", body);

      if (body.status !== 200) {
        setErrorMessage("Invalid tenant name. Please try again.");
        return;
      }

      setTenantValidated(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error validating tenant name: ", error);
      setErrorMessage("Error validating tenant name. Please try again.");
    }
  };

  const handleSignInFlow = (provider: string) => {
    if (tenantValidated) {
      signIn(provider, { callbackUrl: "/" });
    } else {
      setErrorMessage("Please validate the tenant name before signing in.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }


  const handleTenantRegister = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/register/" + tenant;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ tenant: tenant }),
        });
        const body = await response.json();
        if (body.status !== 200) {
            setErrorMessage("Error registering tenant. Please try again.");
            return;
        }
        setTenantValidated(true);
    }
    catch (error) {
        console.error("Error registering tenant: ", error);
        setErrorMessage("Error registering tenant. Please try again.");
    }
  }

  return (
    <div>
      {!tenantValidated ? (
        <div>
          <h2>Enter Tenant Name</h2>
          <input
            type="text"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            placeholder="Tenant name"
            className="border p-2 rounded mb-2"
          />
          <button
            onClick={handleTenantSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Tenant Name
          </button>
          <button onClick={handleTenantRegister} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Register a new tenant
        </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <button
            onClick={() => handleSignInFlow("github")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
