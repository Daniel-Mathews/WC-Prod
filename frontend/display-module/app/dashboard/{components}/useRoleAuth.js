"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * A custom hook to handle role-based authentication.
 * It verifies a user's token and checks if their role matches the required role.
 *
 * @param {string} requiredRole - The role needed to access the component.
 * @returns {boolean} - Returns true if the user is authenticated and has the required role.
 */
const useRoleAuth = (requiredRole) => {
    const router = useRouter();
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        const verifyRole = async () => {
            const token = localStorage.getItem("token");

            // If there's no token, redirect to the login page
            if (!token) {
                router.push("/");
                return;
            }

            try {
                // Call the new backend endpoint to verify the role
                const response = await fetch(`http://127.0.0.1:8001/verify-role/${token}`);
                const data = await response.json();
                const userRole = data.role;

                if (response.status !== 200 || userRole !== requiredRole) {
                    // Redirect to the home page or a 403 page without removing the token
                    // The user's session remains intact
                    router.push("/dashboard"); 
                    return;
                }
                
                // If the token is valid and the role matches, set the state
                setHasRole(true); 
                
            } catch (error) {
                console.error(error.message);
                // If there's a problem with the token itself, redirect the user
                router.push("/");
            }
        };

        verifyRole();
    }, [router, requiredRole]);

    return hasRole;
};

export default useRoleAuth;
