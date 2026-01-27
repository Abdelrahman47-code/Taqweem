'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, GraduationCap, BarChart3, LogOut, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
    { name: 'بنك الأسئلة', href: '/dashboard/questions', icon: BookOpen },
    { name: 'الاختبارات', href: '/dashboard/exams', icon: GraduationCap },
    { name: 'النتائج والتقارير', href: '/dashboard/results', icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-l h-screen flex flex-col fixed ml-64 hidden md:flex">
            <div className="p-6 border-b flex items-center justify-center">
                <Image
                    src="/logo.jpg"
                    alt="تقويم"
                    width={100}
                    height={40}
                    className="h-10 w-auto object-contain"
                />
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const LinkIcon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <LinkIcon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t space-y-2">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                    <Settings className="w-5 h-5" />
                    <span>الإعدادات</span>
                </Link>
                <button
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg text-right"
                >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
