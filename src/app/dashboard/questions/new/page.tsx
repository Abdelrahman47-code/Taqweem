'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SUBJECT_OPTIONS = [
    'اللغة العربية',
    'التربية الإسلامية',
    'الرياضيات',
    'العلوم',
    'اللغة الإنجليزية',
    'الدراسات الاجتماعية',
    'الحاسب الآلي',
    'أخرى'
];

export default function NewQuestionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        text: '',
        subject: '',
        skill: '',
        difficulty: 'medium',
        correctAnswer: '',
        options: ['', '', '', ''], // 4 options default
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('فشل حفظ السؤال');

            router.push('/dashboard/questions');
            router.refresh();
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">إضافة سؤال جديد</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نص السؤال</label>
                    <textarea
                        name="text"
                        required
                        rows={3}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="اكتب السؤال هنا..."
                        value={formData.text}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                        <select
                            name="subject"
                            required
                            className="w-full p-2 border rounded-lg"
                            value={formData.subject}
                            onChange={handleChange}
                        >
                            <option value="">اختر المادة</option>
                            {SUBJECT_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المهارة</label>
                        <input
                            type="text"
                            name="skill"
                            required
                            className="w-full p-2 border rounded-lg"
                            placeholder="مثال: الجمع والطرح"
                            value={formData.skill}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الصعوبة</label>
                        <select
                            name="difficulty"
                            className="w-full p-2 border rounded-lg"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="easy">سهل</option>
                            <option value="medium">متوسط</option>
                            <option value="hard">صعب</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الإجابة الصحيحة</label>
                        <select
                            name="correctAnswer"
                            required
                            className="w-full p-2 border rounded-lg"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                        >
                            <option value="">اختر الإجابة الصحيحة</option>
                            {formData.options.map((opt, idx) => (
                                opt && <option key={idx} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">الخيارات (للاختيار من متعدد)</label>
                    {formData.options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <span className="text-gray-400 text-sm">{idx + 1}.</span>
                            <input
                                type="text"
                                required
                                className="flex-1 p-2 border rounded-lg"
                                placeholder={`الخيار ${idx + 1}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'جاري الحفظ...' : 'حفظ السؤال'}
                    </button>
                </div>
            </form>
        </div>
    );
}
