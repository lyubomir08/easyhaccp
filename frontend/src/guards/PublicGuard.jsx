import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function PublicGuard() {
    const { user } = useUser();

    return user ? <Navigate to="/" replace /> : <Outlet />;
}