'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewExamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        grade: '',
    });

    useEffect(() => {
        // Fetch available questions
        fetch('/api/questions')
            .then(res => res.json())
            .then(data => setQuestions(data.questions || []))
            .catch(err => console.error(err));
    }, []);

    const handleSelect = (id: string) => {
        setSelectedQuestions(prev =>
            prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedQuestions.length === 0) {
            alert('الرجاء اختيار سؤال واحد على الأقل');
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    questions: selectedQuestions
                }),
            });

            if (!res.ok) throw new Error('فشل إنشاء الاختبار');

            router.push('/dashboard/exams');
            router.refresh();
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">إنشاء اختبار جديد</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Exam Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <h2 className="font-semibold text-lg text-gray-700 border-b pb-2">بيانات الاختبار</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الاختبار</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                placeholder="مثال: اختبار منتصف الفصل"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الصف الدراسي</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                placeholder="مثال: الصف الخامس"
                                required
                                value={formData.grade}
                                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                placeholder="مثال: رياضيات"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Selection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="font-semibold text-lg text-gray-700">اختيار الأسئلة</h2>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            تم اختيار {selectedQuestions.length}
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {questions.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">لم يتم إضافة أسئلة للبنك بعد.</p>
                        ) : (
                            questions.map(q => (
                                <div
                                    key={q._id}
                                    onClick={() => handleSelect(q._id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedQuestions.includes(q._id)
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center mt-1 ${selectedQuestions.includes(q._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                                            }`}>
                                            {selectedQuestions.includes(q._id) && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{q.text}</p>
                                            <div className="flex gap-2 mt-2 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-1 rounded">{q.subject}</span>
                                                <span className="bg-gray-100 px-2 py-1 rounded">{q.skill}</span>
                                                <span>{q.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold shadow-sm"
                    >
                        {loading ? 'جاري الإنشاء...' : 'إنشاء الاختبار'}
                    </button>
                </div>
            </form>
        </div>
    );
}
