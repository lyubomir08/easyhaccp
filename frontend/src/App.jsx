import { BrowserRouter, Routes, Route } from "react-router";

import { UserProvider } from "./contexts/UserContext.jsx";

import PublicGuard from "./guards/PublicGuard";
import PrivateGuard from "./guards/PrivateGuard";
import AdminGuard from "./guards/AdminGuard";

import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
// import Dashboard from "./components/pages/Dashboard";
// import AdminPanel from "./components/pages/AdminPanel";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<PublicGuard />}>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Route>

        <Route element={<PrivateGuard />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          <Route element={<AdminGuard />}>
            {/* <Route path="/app/admin" element={<AdminPanel />} /> */}
          </Route>
        </Route>
      </Routes>
    </UserProvider>
  );
}
