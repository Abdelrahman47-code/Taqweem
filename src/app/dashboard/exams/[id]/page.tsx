import connectDB from '@/lib/db';
import Exam from '@/models/Exam';
import ExamSettingsParams from '@/components/dashboard/ExamSettingsParams';
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { id: string };
}

export const dynamic = 'force-dynamic';

async function getExam(id: string) {
    await connectDB();
    const exam = await Exam.findById(id);
    if (!exam) return null;
    return exam;
}

export default async function ExamDetailsPage({ params }: PageProps) {
    const exam = await getExam(params.id);

    if (!exam) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/exams" className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowRight className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
                </div>
                <Link
                    href={`/dashboard/results?exam=${exam._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                >
                    <BarChart3 className="w-5 h-5" />
                    <span>عرض النتائج</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings Card */}
                <ExamSettingsParams
                    examId={exam._id.toString()}
                    initialActive={exam.isActive}
                    initialTimeLimit={exam.timeLimit || 0}
                    examCode={exam.code}
                />

                {/* Question Preview (Optional) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الاختبار</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">المادة</span>
                            <span className="font-medium">{exam.subject}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">الصف/المرحلة</span>
                            <span className="font-medium">{exam.grade}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">عدد الأسئلة</span>
                            <span className="font-medium">{exam.questions?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">تاريخ الإنشاء</span>
                            <span className="font-medium">{new Date(exam.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
