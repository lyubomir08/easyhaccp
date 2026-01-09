import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-[calc(100vh-72px)] bg-slate-50">
            <Sidebar />

            <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
