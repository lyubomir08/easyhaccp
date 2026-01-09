import { Routes, Route } from "react-router";

import { UserProvider } from "./contexts/UserContext.jsx";

import PublicGuard from "./guards/PublicGuard";
import PrivateGuard from "./guards/PrivateGuard";
import AdminGuard from "./guards/AdminGuard";

import Header from "./components/layout/Header.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";

import Home from "./components/home/Home.jsx";
import Login from "./components/auth/login/Login.jsx";
import Register from "./components/auth/register/Register.jsx";
import About from "./components/about/About.jsx";

export default function App() {
    return (
        <UserProvider>
            <Header />

            <Routes>
                <Route path="/about" element={<About />} />

                <Route element={<PublicGuard />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<Register />} />
                </Route>

                <Route element={<PrivateGuard />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route element={<AdminGuard />}>
                            {/* <Route path="/admin" element={<AdminPanel />} /> */}
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </UserProvider>
    );
}
