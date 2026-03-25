import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-72px)] bg-slate-100 relative">
            {/* Overlay за мобилен */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-30
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 md:flex
                h-full
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
                {/* Хамбургер бутон — само мобилен */}
                <button
                    className="md:hidden mb-4 p-2 rounded-md bg-white border border-slate-200 shadow-sm text-slate-700"
                    onClick={() => setSidebarOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <Outlet />
            </main>
        </div>
    );
}