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
    const handleTenantSubmit = () => {
        // Replace with actual tenant validation logic
        const validTenants = ["tenant1", "tenant2", "tenant3"];
        
        if (validTenants.includes(tenant.toLowerCase())) {
            setTenantValidated(true);
            setErrorMessage("");
        } else {
            setErrorMessage("Invalid tenant name. Please try again.");
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
