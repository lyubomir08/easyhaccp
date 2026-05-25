import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-[calc(100vh-72px)] bg-slate-100">
            {/* Desktop sidebar — always visible on md+ */}
            <div className="hidden md:flex h-full">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
                <Outlet />
            </main>
        </div>
    );
}
