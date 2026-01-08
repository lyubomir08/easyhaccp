import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
