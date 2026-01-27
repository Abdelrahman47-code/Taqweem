'use client';

import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-40">
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
                    <span className="text-sm font-medium text-gray-700">مرحباً، المعلم</span>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        م
                    </div>
                </div>
            </div>
        </header>
    );
}
