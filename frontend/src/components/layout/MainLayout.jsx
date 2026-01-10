import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-[calc(100vh-72px)] bg-slate-100">
            <Sidebar />

            <main className="flex-1 overflow-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}
