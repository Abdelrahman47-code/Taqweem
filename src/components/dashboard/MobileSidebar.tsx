'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-20 right-4 z-50 p-2 bg-white rounded-lg shadow-md border text-gray-700"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed inset-y-0 right-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full overflow-y-auto">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
