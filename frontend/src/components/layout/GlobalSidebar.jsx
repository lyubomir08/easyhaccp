import useUser from "../../hooks/useUser";
import Sidebar from "./Sidebar";

export default function GlobalSidebar() {
    const { user, sidebarOpen, setSidebarOpen } = useUser();

    if (!user) return null;

    return (
        <>
            {/* Dark overlay — full screen, behind header */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar drawer — full height, header sits on top via z-50 */}
            <div className={`
                fixed top-0 left-0 z-40 h-screen
                transform transition-transform duration-300 ease-in-out
                md:hidden
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
        </>
    );
}
