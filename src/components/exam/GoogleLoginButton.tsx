'use client';

import { useEffect, useState } from 'react';

interface GoogleLoginProps {
    onSuccess: (name: string, email: string) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && window.google && clientId) {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large", width: "100%", text: "continue_with" }
            );
        }
    }, [isLoaded, clientId]);

    const handleCredentialResponse = (response: any) => {
        try {
            // Simple JWT decode for client-side display
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            if (payload.name && payload.email) {
                onSuccess(payload.name, payload.email);
            }
        } catch (e) {
            console.error('Error decoding Google credential', e);
        }
    };

    if (!clientId) {
        return (
            <div className="text-xs text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200">
                Setup Error: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in env.
            </div>
        );
    }

    return (
        <div className="w-full mb-4">
            <div id="googleSignInDiv" className="w-full h-[40px] flex justify-center"></div>
        </div>
    );
}
