'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Save, RefreshCw } from 'lucide-react';

export default function AIGeneratorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
    const [params, setParams] = useState({
        subject: '',
        skill: '',
        difficulty: 'medium',
        count: 3,
    });

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneratedQuestions([]);

        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const data = await res.json();
            if (res.ok) {
                setGeneratedQuestions(data.questions);
            } else {
                alert('فشل التوليد: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ غير متوقع');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAll = async () => {
        if (!confirm('هل أنت متأكد من حفظ هذه الأسئلة في بنك الأسئلة؟')) return;

        setLoading(true);
        try {
            // Save each question sequentially
            for (const q of generatedQuestions) {
                await fetch('/api/questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...q,
                        subject: params.subject,
                        skill: params.skill,
                        difficulty: params.difficulty
                    }),
                });
            }
            alert('تم الحفظ بنجاح!');
            router.refresh();
            router.push('/dashboard/questions');
        } catch (err) {
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    توليد الأسئلة بالذكاء الاصطناعي
                </h1>
                <p className="mt-2 text-purple-100 opacity-90">
                    أدخل المادة والمهارة، وسيقوم النظام بتوليد أسئلة احترافية فوراً.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="md:col-span-1">
                    <form onSubmit={handleGenerate} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                            <input
                                required
                                className="w-full p-2 border rounded-lg"
                                placeholder="مثال: علوم"
                                value={params.subject}
                                onChange={(e) => setParams({ ...params, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المهارة المستهدفة</label>
                            <input
                                required
                                className="w-full p-2 border rounded-lg"
                                placeholder="مثال: التفاعل الكيميائي"
                                value={params.skill}
                                onChange={(e) => setParams({ ...params, skill: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى الصعوبة</label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={params.difficulty}
                                onChange={(e) => setParams({ ...params, difficulty: e.target.value })}
                            >
                                <option value="easy">سهل</option>
                                <option value="medium">متوسط</option>
                                <option value="hard">صعب</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأسئلة</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                required
                                className="w-full p-2 border rounded-lg"
                                value={params.count}
                                onChange={(e) => setParams({ ...params, count: parseInt(e.target.value) || 3 })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    توليد الأسئلة
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Display */}
                <div className="md:col-span-2 space-y-4">
                    {generatedQuestions.length > 0 && (
                        <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200">
                            <span className="text-green-800 font-medium">تم توليد {generatedQuestions.length} سؤال بنجاح</span>
                            <button
                                onClick={handleSaveAll}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Save className="w-4 h-4" />
                                حفظ للبنك
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {generatedQuestions.map((q, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border">
                                <div className="flex justify-between mb-3">
                                    <span className="font-bold text-gray-800">السؤال {idx + 1}</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{params.difficulty}</span>
                                </div>
                                <p className="text-lg mb-4 text-gray-800">{q.text}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {q.options?.map((opt: string, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded border text-sm ${opt === q.correctAnswer ? 'bg-green-50 border-green-300 ring-1 ring-green-300' : 'bg-gray-50'}`}
                                        >
                                            {opt}
                                            {opt === q.correctAnswer && <span className="float-left text-green-600 font-bold">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {generatedQuestions.length === 0 && !loading && (
                            <div className="bg-white p-12 rounded-xl shadow-sm border text-center text-gray-400 border-dashed">
                                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>قم بتعبئة النموذج لتوليد الأسئلة</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
