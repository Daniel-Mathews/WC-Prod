'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to the login page or home page
        router.push('/');
    }, [router]);

    return null;
}