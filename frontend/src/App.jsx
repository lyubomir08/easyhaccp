import { Routes, Route } from "react-router";

import { UserProvider } from "./contexts/UserContext.jsx";

import PublicGuard from "./guards/PublicGuard";
import PrivateGuard from "./guards/PrivateGuard";
import AdminGuard from "./guards/AdminGuard";

import Header from "./components/layout/Header.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import AdminApprovals from "./components/admin/AdminApprovals/AdminApprovals.jsx";

import Home from "./components/home/Home.jsx";
import Login from "./components/auth/login/Login.jsx";
import Register from "./components/auth/register/Register.jsx";
import About from "./components/about/About.jsx";
import AdminFirms from "./components/admin/AdminFirms/AdminFirms.jsx";
import AdminObjects from "./components/admin/AdminObjects/AdminObjects.jsx";
import AdminUsers from "./components/admin/AdminUsers/AdminUsers.jsx";
import ChangePassword from "./components/profile/ChangePassword.jsx";
import UserProfile from "./components/profile/UserProfile.jsx";
import MyObjects from "./components/objects/MyObjects.jsx";
import MyFirm from "./components/firm/MyFirm.jsx";
import MyObject from "./components/objects/MyObject.jsx";

export default function App() {
    return (
        <UserProvider>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                <Route element={<PublicGuard />}>
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<Register />} />
                </Route>

                <Route element={<PrivateGuard />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<UserProfile />}/>
                        <Route path="/profile/change-password" element={<ChangePassword />} />
                        <Route path="/myObjects" element={<MyObjects />}/>
                        <Route path="/myFirm" element={<MyFirm />}/>
                        <Route path="/myObject" element={<MyObject />}/>

                        <Route element={<AdminGuard />}>
                            <Route path="/admin/approvals" element={<AdminApprovals />} />
                            <Route path="/admin/firms" element={<AdminFirms />}/>
                            <Route path="/admin/objects" element={<AdminObjects />}/>
                            <Route path="/admin/users" element={<AdminUsers />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </UserProvider>
    );
}
