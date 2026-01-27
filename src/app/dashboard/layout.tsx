import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MobileSidebar from '@/components/dashboard/MobileSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0 print:hidden">
                <Sidebar />
            </div>

            {/* Sidebar - Mobile */}
            <div className="print:hidden">
                <MobileSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="print:hidden">
                    <Header />
                </div>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
