'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { User, School, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        schoolName: '',
        notifications: true,
        defaultDuration: 30,
        defaultGrade: '',
        avatar: ''
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        // Fetch current settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        email: data.email || '',
                        schoolName: data.schoolName || '',
                        notifications: data.notifications ?? true,
                        defaultDuration: data.defaultDuration || 30,
                        defaultGrade: data.defaultGrade || '',
                        avatar: data.avatar || ''
                    }));
                }
            })
            .catch(err => console.error('Failed to load settings', err));
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('تم حفظ الإعدادات بنجاح');
            } else {
                alert('فشل حفظ الإعدادات');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('كلمة المرور الجديدة غير متطابقة');
            return;
        }

        setIsPasswordLoading(true);
        try {
            const res = await fetch('/api/settings/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('تم تغيير كلمة المرور بنجاح');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert('فشل التغيير: ' + data.message);
            }
        } catch (error) {
            alert('حدث خطأ');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">الإعدادات</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">
                        <User className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">المعلومات الشخصية</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative group">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-bold">تغيير</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">صورة الملف الشخصي</p>
                        </div>

                        <div className="flex-1 grid md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الاسم</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* School Info Section */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">
                        <School className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold">بيانات المدرسة</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">اسم المدرسة / المؤسسة</label>
                        <input
                            type="text"
                            value={formData.schoolName}
                            onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                            placeholder="سيظهر هذا الاسم في ترويسة التقارير"
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">سيظهر هذا الاسم في أعلى الاختبارات والتقارير المطبوعة.</p>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">
                        <Bell className="w-5 h-5 text-orange-600" />
                        <h2 className="text-lg font-semibold">التفضيلات</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">إشعارات البريد الإلكتروني</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">استلام إشعار عند تسليم طالب للاختبار</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications}
                                    onChange={e => setFormData({ ...formData, notifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">الوضع الليلي 🌙</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">تفعيل المظهر الداكن للتطبيق</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-1' : 'translate-x-6'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Default Exam Settings */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">
                        <Save className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-semibold">إعدادات الاختبار الافتراضية</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">مدة الاختبار الافتراضية (دقيقة)</label>
                            <input
                                type="number"
                                value={formData.defaultDuration}
                                onChange={e => setFormData({ ...formData, defaultDuration: parseInt(e.target.value) })}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">الصف الدراسي الافتراضي</label>
                            <input
                                type="text"
                                value={formData.defaultGrade}
                                onChange={e => setFormData({ ...formData, defaultGrade: e.target.value })}
                                placeholder="مثال: الصف الأول الثانوي"
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        <span>{isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>

            {/* Password / Security */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold">الحماية وكلمة المرور</h2>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">كلمة المرور الحالية</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400"> كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="bg-red-50 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 border border-red-200 transition font-medium text-sm disabled:opacity-50"
                        >
                            {isPasswordLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
