'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/exam/GoogleLoginButton';

export default function StudentExamPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [exam, setExam] = useState<any>(null);
    const [step, setStep] = useState<'login' | 'exam' | 'result'>('login');
    const [loading, setLoading] = useState(true);

    // Student Data
    const [studentName, setStudentName] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [studentEmail, setStudentEmail] = useState('');

    // Exam Data
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/exams/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.exam) setExam(data.exam);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [params.id]);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (studentName && studentGrade && studentEmail) setStep('exam');
    };

    const handleAnswer = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (!confirm('هل أنت متأكد من تسليم الإجابات؟')) return;
        setLoading(true);

        try {
            const res = await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: exam._id,
                    studentName,
                    studentGrade,
                    studentEmail,
                    answers
                })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                setStep('result');
            } else {
                alert('فشل التسليم: ' + data.message);
            }
        } catch (err) {
            alert('حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-blue-600">جاري التحميل...</div>;
    if (!exam) return <div className="flex justify-center items-center h-screen">الاختبار غير موجود</div>;

    // 1. Login Step
    if (step === 'login') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center font-sans">
                    <h1 className="text-2xl font-bold mb-2 text-gray-800">{exam.title}</h1>
                    <p className="text-gray-500 mb-6">{exam.grade} - {exam.subject}</p>

                    <GoogleLoginButton onSuccess={(name, email) => {
                        setStudentName(name);
                        setStudentEmail(email);
                    }} />

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">أو الدخول يدوياً</span>
                        </div>
                    </div>

                    <form onSubmit={handleStart} className="space-y-4">
                        <input
                            required
                            type="text"
                            placeholder="الاسم الثلاثي"
                            className="w-full p-3 border rounded-lg"
                            value={studentName}
                            onChange={e => setStudentName(e.target.value)}
                        />
                        <input
                            required
                            type="email"
                            placeholder="البريد الإلكتروني"
                            className="w-full p-3 border rounded-lg dir-ltr text-left"
                            value={studentEmail}
                            onChange={e => setStudentEmail(e.target.value)}
                        />
                        <input
                            required
                            type="text"
                            placeholder="الصف / الشعبة"
                            className="w-full p-3 border rounded-lg"
                            value={studentGrade}
                            onChange={e => setStudentGrade(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold">
                            ابدأ الاختبار
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 2. Exam Step
    if (step === 'exam') {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center sticky top-4 z-10 border-b-4 border-blue-600">
                        <div>
                            <span className="text-gray-500 text-sm">الطالب:</span>
                            <span className="font-bold mr-2">{studentName} ({studentEmail})</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold shadow-sm"
                        >
                            تسليم الاختبار
                        </button>
                    </div>

                    {exam.questions.map((q: any, idx: number) => (
                        <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border">
                            <div className="flex gap-3 mb-4">
                                <div className="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full font-bold flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <p className="text-lg font-medium text-gray-900 pt-1">{q.text}</p>
                            </div>

                            <div className="space-y-3 mr-11">
                                {q.options.map((opt: string, i: number) => (
                                    <label
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[q._id] === opt ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q._id}
                                            value={opt}
                                            checked={answers[q._id] === opt}
                                            onChange={() => handleAnswer(q._id, opt)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 3. Result Step
    if (step === 'result') {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans print:bg-white print:p-0">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Success Header (Screen Only) */}
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border-t-8 border-green-500 print:hidden">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">تم التسليم بنجاح!</h1>
                        <p className="text-gray-500 mb-6">شكراً لك يا {studentName}، تم استلام إجاباتك.</p>

                        <div className="bg-gray-100 p-6 rounded-xl mb-6 inline-block min-w-[200px]">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">النتيجة النهائية</p>
                            <div className="text-5xl font-black text-blue-600 my-2">
                                {result.score} <span className="text-2xl text-gray-400">/ {result.maxScore}</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => window.print()}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                            >
                                <span>طباعة التقرير</span>
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                خروج
                            </button>
                        </div>
                    </div>

                    {/* Classification & AI Plan */}
                    {(result.classification || result.suggestedPlan) && (
                        <div className="space-y-6 print:hidden">
                            {/* Classification Card */}
                            <div className={`p-6 rounded-xl shadow-sm text-center text-white ${result.classification === 'Excellent' ? 'bg-green-500' :
                                result.classification === 'Very Good' ? 'bg-teal-500' :
                                    result.classification === 'Good' ? 'bg-blue-500' :
                                        result.classification === 'Acceptable' ? 'bg-orange-500' : 'bg-red-500'
                                }`}>
                                <h3 className="text-xl font-bold mb-2">تصنيف الطالب حسب المستوى</h3>
                                <div className="text-4xl font-black mb-1">
                                    {result.classification === 'Excellent' ? '🌟 ممتاز' :
                                        result.classification === 'Very Good' ? '👍 جيد جداً' :
                                            result.classification === 'Good' ? '👌 جيد' :
                                                result.classification === 'Acceptable' ? '⚠️ مقبول' : '🛑 بحاجة لتحسين'}
                                </div>
                                <p className="opacity-90">
                                    {result.classification === 'Excellent' ? 'أداء رائع! حافظ على هذا المستوى.' :
                                        result.classification === 'Weak' ? 'لا تيأس، خطة العلاج ستساعدك.' : 'بداية جيدة، يمكننا التحسن أكثر.'}
                                </p>
                            </div>

                            {/* AI Plan Card */}
                            {result.suggestedPlan && (
                                <div className={`border-2 rounded-xl overflow-hidden ${result.suggestedPlan.type === 'enrichment' ? 'border-purple-200 bg-purple-50' : 'border-orange-200 bg-orange-50'
                                    }`}>
                                    <div className={`p-4 text-white font-bold text-lg flex justify-between items-center ${result.suggestedPlan.type === 'enrichment' ? 'bg-purple-600' : 'bg-orange-600'
                                        }`}>
                                        <span>{result.suggestedPlan.title}</span>
                                        <span>{result.suggestedPlan.type === 'enrichment' ? '🚀' : '🛠️'}</span>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {result.suggestedPlan.content}
                                        </p>

                                        {/* Exercises */}
                                        {result.suggestedPlan.exercises && result.suggestedPlan.exercises.length > 0 && (
                                            <div className="space-y-4 mt-6">
                                                <h4 className="font-bold text-gray-800 border-b pb-2">
                                                    {result.suggestedPlan.type === 'enrichment' ? 'تحدي العباقرة:' : 'تدريب لتعزيز الفهم:'}
                                                </h4>
                                                {result.suggestedPlan.exercises.map((ex: any, i: number) => (
                                                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                        <p className="font-medium mb-3 text-gray-900">{ex.text}</p>
                                                        <div className="space-y-2">
                                                            {ex.options && ex.options.map((opt: string, idx: number) => (
                                                                <button
                                                                    key={idx}
                                                                    className="block w-full text-right px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                                                                    onClick={(e) => {
                                                                        const target = e.currentTarget;
                                                                        // Robust comparison
                                                                        const isCorrect = opt.trim() === ex.correctAnswer?.trim();

                                                                        if (isCorrect) {
                                                                            target.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
                                                                            target.innerText += ' ✅';
                                                                        } else {
                                                                            target.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
                                                                            target.innerText += ' ❌';
                                                                        }
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Review Section (Print & Screen) */}
                    <div className="space-y-6 print:space-y-4">
                        <div className="hidden print:block text-center border-b pb-4 mb-8">
                            <h1 className="text-2xl font-bold">{exam.title} - تقرير الطالب</h1>
                            <p>الطالب: {studentName} ({studentEmail}) | الدرجة: {result.score}/{result.maxScore}</p>
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 print:hidden">مراجعة الإجابات</h2>

                        {exam.questions.map((q: any, idx: number) => {
                            const feedbackItem = result.feedback?.find((f: any) => f.questionId === q._id);
                            const isCorrect = feedbackItem?.isCorrect;
                            const correctAnswer = feedbackItem?.correctAnswer;
                            const studentAns = feedbackItem?.userAnswer || '';

                            return (
                                <div key={q._id} className={`bg-white p-6 rounded-xl shadow-sm border print:border-none print:shadow-none print:p-0 ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                                    <div className="flex gap-3 mb-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-gray-900">{q.text}</p>
                                        </div>
                                        <div className="print:hidden">
                                            {isCorrect ? (
                                                <span className="text-green-600 font-bold text-sm">اجابة صحيحة</span>
                                            ) : (
                                                <span className="text-red-600 font-bold text-sm">اجابة خاطئة</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mr-11">
                                        {q.options.map((opt: string, i: number) => {
                                            const isSelected = studentAns === opt;
                                            const isTheCorrectAnswer = opt === correctAnswer;

                                            let styles = "border-gray-200 bg-white";
                                            // Logic: Green if it's the correct answer (always show correct answer in green)
                                            // Red if selected and wrong
                                            if (isTheCorrectAnswer) styles = "border-green-500 bg-green-50 font-semibold ring-1 ring-green-500";
                                            else if (isSelected && !isCorrect) styles = "border-red-300 bg-red-50 text-red-700";

                                            // Ensure we don't double style if selected IS correct (covered by first if)
                                            // But if selected is correct, it falls into first if.

                                            return (
                                                <div key={i} className={`p-3 rounded-lg border flex justify-between items-center ${styles}`}>
                                                    <span className="flex items-center gap-2">
                                                        {isSelected && <span className="w-2 h-2 rounded-full bg-current"></span>}
                                                        {opt}
                                                    </span>
                                                    {isTheCorrectAnswer && <span className="text-green-600 text-sm font-bold">الإجابة الصحيحة</span>}
                                                    {isSelected && !isCorrect && <span className="text-red-500 text-sm">إجابتك</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block text-center mt-8 pt-4 border-t text-xl font-bold text-gray-800">
                        تصميم: الأستاذة خديجه ظافر الشهري
                    </div>
                </div>
            </div>
        );
    }
}
