import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function PrivateGuard() {
    const { user } = useUser();

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}