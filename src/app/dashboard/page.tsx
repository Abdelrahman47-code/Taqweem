import Link from 'next/link';
import { BookOpen, GraduationCap, Users, Layers } from 'lucide-react';
import { headers } from 'next/headers';

async function getStats() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stats`, {
            method: 'GET',
            headers: headers(),
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function DashboardPage() {
    const stats = await getStats() || { questions: 0, activeExams: 0, totalExams: 0, students: 0 };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Card 1: Questions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">الأسئلة في البنك</p>
                        <h3 className="text-2xl font-bold">{stats.questions}</h3>
                    </div>
                </div>

                {/* Card 2: Total Exams */}
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">إجمالي الاختبارات</p>
                        <h3 className="text-2xl font-bold">{stats.totalExams}</h3>
                    </div>
                </div>

                {/* Card 3: Active Exams */}
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">الاختبارات النشطة</p>
                        <h3 className="text-2xl font-bold">{stats.activeExams}</h3>
                    </div>
                </div>

                {/* Card 4: Students */}
                <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">الطلاب الذين اختبروا</p>
                        <h3 className="text-2xl font-bold">{stats.students}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">إجراءات سريعة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/questions" className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition">
                        <h3 className="font-bold text-blue-900 mb-2">إضافة سؤال جديد</h3>
                        <p className="text-sm text-blue-700">إضافة سؤال يدوياً أو باستخدام الذكاء الاصطناعي</p>
                    </Link>
                    <Link href="/dashboard/exams" className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition">
                        <h3 className="font-bold text-green-900 mb-2">إنشاء اختبار جديد</h3>
                        <p className="text-sm text-green-700">تكوين اختبار جديد ومشاركته مع الطلاب</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
