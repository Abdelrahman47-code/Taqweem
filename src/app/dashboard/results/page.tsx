import Link from 'next/link';
import { headers } from 'next/headers';
import { FileText, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import PrintButton from '@/components/dashboard/PrintButton';
import ExportExcelButton from '@/components/dashboard/ExportExcelButton';

async function getResults() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/results`, {
        method: 'GET',
        headers: headers(),
        cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
}

export default async function ResultsPage() {
    const results = await getResults();

    return (
        <div className="space-y-6 print:p-0 print:space-y-0">

            {/* Header - Screen Only */}
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold text-gray-800">النتائج والتقارير</h1>
                <div className="flex gap-2">
                    <ExportExcelButton data={results.map((r: any) => ({
                        'الطالب': r.studentName,
                        'الهوية': r.studentId,
                        'الاختبار': r.examId?.title,
                        'الدرجة': `${r.totalScore} / ${r.maxScore}`,
                        'نقاط الضعف': r.weaknesses?.join(', ') || 'لا يوجد'
                    }))} filename="taqweem-results.csv" />
                    <PrintButton />
                </div>
            </div>

            {/* Printable Header - Print Only */}
            <div className="hidden print:block text-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold mb-2">تقرير نتائج الطلاب</h1>
                <p className="text-gray-500">نظام التشخيص التعليمي الذكي (Taqweem)</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden print:border-none print:shadow-none">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 print:bg-white print:border-b-2 print:border-black">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase">الطالب</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase hidden md:table-cell">الهوية</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase">الاختبار</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase">الدرجة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase">التحسن</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 print:text-black uppercase">التحليل</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    لا توجد نتائج حتى الآن.
                                </td>
                            </tr>
                        ) : (
                            results.map((r: any) => (
                                <tr key={r._id} className="print:break-inside-avoid">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{r.studentName}</div>
                                        <div className="text-xs text-gray-500 md:hidden">{r.studentId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{r.studentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.examId?.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                        {r.totalScore} / {r.maxScore}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {r.improvement > 0 ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" /> +{r.improvement.toFixed(1)}%
                                            </span>
                                        ) : r.improvement < 0 ? (
                                            <span className="text-red-500 flex items-center gap-1">
                                                <TrendingDown className="w-4 h-4" /> {r.improvement.toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 flex items-center gap-1">
                                                <Minus className="w-4 h-4" /> -
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2 flex-wrap">
                                            {r.weaknesses && r.weaknesses.length > 0 ? (
                                                <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs flex items-center gap-1 print:border print:border-red-200">
                                                    <AlertCircle className="w-3 h-3" />
                                                    ضعف: {r.weaknesses.join(', ')}
                                                </span>
                                            ) : (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs flex items-center gap-1 print:border print:border-green-200">
                                                    <TrendingUp className="w-3 h-3" />
                                                    ممتاز
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer - Print Only */}
            <footer className="hidden print:block fixed bottom-0 left-0 w-full text-center p-4 border-t text-sm text-gray-600 font-semibold bg-white">
                تصميم فكرة المشروع: الأستاذة خديجه ظافر الشهري
            </footer>
        </div>
    );
}
