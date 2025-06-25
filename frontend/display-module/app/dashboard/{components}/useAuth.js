"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const useAuth = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Add loading state

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://127.0.0.1:8001/verify-token/${token}`);
                if (response.status !== 200) {
                    throw new Error("Token is invalid");
                }
                else {
                    setIsAuthenticated(true); // Mark as authenticated
                }
            } catch (error) {
                localStorage.removeItem("token");
                router.push("/");
            } finally {
                
            }
        };

        verifyToken();
    }, [router]);

    return isAuthenticated; // Return the loading state
};

export default useAuth;
