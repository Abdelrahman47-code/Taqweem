'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@headlessui/react';
import { Clock, Lock, Unlock, Copy, Check } from 'lucide-react';

interface ExamSettingsProps {
    examId: string;
    initialActive: boolean;
    initialTimeLimit: number;
    examCode: string;
}

export default function ExamSettingsParams({ examId, initialActive, initialTimeLimit, examCode }: ExamSettingsProps) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(initialActive);
    const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const updateSettings = async (newActive: boolean, newTime: number) => {
        setLoading(true);
        try {
            await fetch(`/api/exams/${examId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newActive, timeLimit: newTime }),
            });
            setIsActive(newActive);
            setTimeLimit(newTime);
            router.refresh();
            alert('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            alert('فشل تحديث الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(examCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                ⚙️ إعدادات الاختبار
            </h2>

            {/* Exam Code */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                <div>
                    <label className="text-xs font-bold text-blue-600 uppercase">كود الاختبار</label>
                    <div className="text-2xl font-mono font-bold text-gray-800 tracking-widest">{examCode}</div>
                </div>
                <button
                    onClick={copyCode}
                    className="p-2 bg-white rounded-md shadow-sm text-gray-600 hover:text-blue-600 transition"
                    title="نسخ الكود"
                >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isActive ? <Unlock className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-red-500" />}
                    <div>
                        <div className="font-semibold text-gray-800">حالة الاختبار</div>
                        <div className="text-xs text-gray-500">{isActive ? 'متاح للطلاب' : 'مغلق حالياً'}</div>
                    </div>
                </div>
                <Switch
                    checked={isActive}
                    onChange={(val) => updateSettings(val, timeLimit)}
                    className={`${isActive ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                >
                    <span className={`${isActive ? 'translate-x-1' : 'translate-x-6'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
            </div>

            {/* Timer Setting */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div className="font-semibold text-gray-800">وقت الاختبار (بالدقائق)</div>
                </div>
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="0"
                        className="flex-1 p-2 border rounded-lg text-center"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                    />
                    <button
                        onClick={() => updateSettings(isActive, timeLimit)}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                    >
                        حفظ
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">تلميح: ضع 0 لجعله مفتوح الوقت.</p>
            </div>
        </div>
    );
}
