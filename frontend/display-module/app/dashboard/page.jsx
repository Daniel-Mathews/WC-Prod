"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            console.log(token);
            try {
                const response = await fetch(`http://127.0.0.1:8000/verify-token/${token}`);

                if (response.status !== 200) {
                    throw new Error("Token is invalid");
                }
            } catch (error) {
                localStorage.removeItem("token");
                router.push("/");
            }
        };

        verifyToken();
    }, [router]);

    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    );
}

export default Page;
