import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-800">تقويم | Taqweem</div>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm font-semibold"
            >
              بوابة المعلمين
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm font-semibold"
            >
              بدء الاختبار
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 gap-12">
        <div className="max-w-4xl text-center lg:text-right space-y-8">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#2c3e50] leading-tight">
            منصة تقويم: رفيقك الذكي
            <br />
            <span className="text-blue-600 text-3xl lg:text-5xl block mt-2">للتميز الدراسي</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            منصة متكاملة تعتمد على الذكاء الاصطناعي لتشخيص الفجوات التعليمية بدقة، وتصميم مسارات تعلم ذكية تضمن التفوق الدراسي.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500 hover:transform hover:-translate-y-1 transition duration-300">
              <div className="text-blue-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto lg:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">تشخيص دقيق</h3>
              <p className="text-sm text-gray-500">تحليل الفجوات المهارية ونقاط القوة</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-green-500 hover:transform hover:-translate-y-1 transition duration-300">
              <div className="text-green-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto lg:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">برامج إثرائية</h3>
              <p className="text-sm text-gray-500">أنشطة إثرائية لتعزيز إتقان المهارات</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-purple-500 hover:transform hover:-translate-y-1 transition duration-300">
              <div className="text-purple-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto lg:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-1">بنك أسئلة ذكي</h3>
              <p className="text-sm text-gray-500">توليد اختبارات متنوعة وتفاعلية</p>
            </div>
          </div>
        </div>

        {/* Visual Element */}
        <div className="hidden lg:block relative">
          <div className="w-96 h-96 bg-blue-600 rounded-full opacity-5 absolute top-0 left-0 blur-3xl animate-pulse"></div>
          <div className="w-80 h-80 bg-white rounded-full flex items-center justify-center border-4 border-blue-50 shadow-xl relative z-10 overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="شعار تقويم"
              width={350}
              height={350}
              className="object-contain p-4"
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 text-center">
        <div className="mb-2 font-semibold text-gray-700">تصميم فكرة المشروع: الأستاذة خديجه ظافر الشهري</div>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} منصة تقويم. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
