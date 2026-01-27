import Link from 'next/link';
import { Plus, Sparkles, Pencil, RefreshCcw } from 'lucide-react';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import DeleteQuestionButton from '@/components/questions/DeleteQuestionButton';
// import QuestionList from '@/components/questions/QuestionList'; 

export const dynamic = 'force-dynamic';

async function getQuestions() {
    await connectDB();
    // Fetch questions sorted by newest
    const questions = await Question.find({}).sort({ createdAt: -1 }).limit(50);
    return questions;
}

export default async function QuestionsPage() {
    const questions = await getQuestions();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">بنك الأسئلة</h1>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/questions"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition border"
                        title="تحديث القائمة"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/dashboard/questions/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة يدوي</span>
                    </Link>
                    <Link
                        href="/dashboard/questions/generate"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-sm"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>توليد بالذكاء الاصطناعي</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نص السؤال</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المادة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المهارة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصعوبة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {questions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    لا توجد أسئلة مضافة حتى الآن. ابدأ بإضافة أسئلة جديدة.
                                </td>
                            </tr>
                        ) : (
                            questions.map((q: any) => (
                                <tr key={q._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{q.text}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.skill}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${q.difficulty === 'easy' ? 'bg-green-100 text-green-800' : ''}
                                ${q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${q.difficulty === 'hard' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                                            {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/questions/${q._id}/edit`}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                                                title="تعديل السؤال"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </Link>
                                            <DeleteQuestionButton id={q._id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
