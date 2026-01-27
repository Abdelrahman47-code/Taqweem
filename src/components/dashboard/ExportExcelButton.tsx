'use client';

import { Download } from 'lucide-react';

interface ExportButtonProps {
    data: any[];
    filename?: string;
}

export default function ExportExcelButton({ data, filename = 'results.csv' }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) return alert('لا توجد بيانات للتصدير');

        // 1. Convert to CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
        const csvContent = '\uFEFF' + [headers, ...rows].join('\n'); // Add BOM for Excel Arabic support

        // 2. Create Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 3. Trigger Download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
            <Download className="w-4 h-4" />
            <span>تصدير Excel</span>
        </button>
    );
}
