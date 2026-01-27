'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ExamCodeProps {
    code: string;
}

export default function ExamCodeDisplay({ code }: ExamCodeProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent triggering parent Link click if inside one
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 hover:border-gray-300 transition-all font-mono text-sm"
            title="انقر لنسخ كود الاختبار"
        >
            <span className="font-bold text-gray-700 tracking-wider">
                {code}
            </span>
            {copied ? (
                <Check className="w-4 h-4 text-green-600" />
            ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            )}
        </button>
    );
}
