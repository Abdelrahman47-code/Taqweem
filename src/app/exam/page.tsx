'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamPage() {
    const router = useRouter();
    const [examId, setExamId] = useState('');

    const handleEnter = (e: React.FormEvent) => {
        e.preventDefault();
        if (examId.trim()) {
            router.push(`/exam/${examId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">بوابة الاختبارات</h1>
                <p className="mb-6 text-gray-600">أدخل "كود الاختبار" للدخول.</p>

                <form onSubmit={handleEnter} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="كود الاختبار (Exam ID)"
                            className="w-full p-3 border rounded-lg text-center text-lg tracking-widest"
                            value={examId}
                            onChange={(e) => setExamId(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition-colors"
                    >
                        دخول للاختبار
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                        * يجب الحصول على كود الاختبار من المعلم
                    </p>
                </form>
            </div>
        </div>
    );
}
