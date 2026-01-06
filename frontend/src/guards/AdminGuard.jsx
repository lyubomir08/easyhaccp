import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function AdminGuard() {
    const { user } = useUser();

    return user && user.role === "admin"
        ? <Outlet />
        : <Navigate to="/" replace />;
}