'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteQuestionButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/questions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('فشل الحذف');
            }
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:bg-red-50 p-2 rounded-full transition disabled:opacity-50"
            title="حذف السؤال"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
