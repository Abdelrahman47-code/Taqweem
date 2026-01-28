'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Header() {
    const [user, setUser] = useState({ name: 'المعلم', avatar: '' });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.name) {
                    setUser({ name: data.name, avatar: data.avatar || '' });
                }
            })
            .catch(console.error);
    }, []);

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-40 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-4">
                {/* Mobile menu trigger could go here */}
                <div className="md:hidden">
                    <Image
                        src="/logo.jpg"
                        alt="تقويم"
                        width={80}
                        height={32}
                        className="h-8 w-auto object-contain"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">مرحباً، {user.name}</span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden border border-gray-200 dark:border-gray-600">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
