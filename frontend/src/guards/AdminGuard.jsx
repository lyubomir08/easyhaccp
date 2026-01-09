import { Navigate, Outlet } from "react-router";
import useUser from "../hooks/useUser";

export default function AdminGuard() {
    const { user, isAdmin } = useUser();

    if (!user) return <Navigate to="/sign-in" />;
    if (!isAdmin) return <Navigate to="/dashboard" />;

    return <Outlet />;
}