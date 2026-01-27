import Link from 'next/link';
import { Plus, Eye, Share2, Trash2 } from 'lucide-react';
import { headers } from 'next/headers';
import ExamCodeDisplay from '@/components/dashboard/ExamCodeDisplay';

async function getExams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/exams`, {
        method: 'GET',
        headers: headers(),
        cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.exams || [];
}

export default async function ExamsPage() {
    const exams = await getExams();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">الاختبارات</h1>
                <Link
                    href="/dashboard/exams/new"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>إنشاء اختبار جديد</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed text-gray-500">
                        لا توجد اختبارات. قم بإنشاء اختبارك الأول.
                    </div>
                ) : (
                    exams.map((exam: any) => (
                        <div key={exam._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Link href={`/dashboard/exams/${exam._id}`} className="hover:underline">
                                        <h3 className="font-bold text-lg text-gray-900">{exam.title}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-500">{exam.grade} - {exam.subject}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${exam.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {exam.isActive ? 'نشط' : 'مغلق'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-gray-500">
                                        {exam.questions.length} أسئلة
                                    </div>
                                    <div className="h-4 w-px bg-gray-200"></div>
                                    {exam.code && <ExamCodeDisplay code={exam.code} />}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`/exam/${exam._id}`}
                                        className="hidden"
                                    />
                                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="معاينة">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {/* Removed unused Share button in favor of Code Display */}
                                    <Link
                                        href={`/dashboard/exams/${exam._id}`}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                        title="إدارة الاختبار"
                                    >
                                        <span className="text-sm font-semibold">إعدادات</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
