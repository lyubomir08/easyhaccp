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
import Employees from "./components/employees/Employees.jsx";
import FoodGroups from "./components/foodGroups/FoodGroups.jsx";
import Recipes from "./components/recipes/Recipes.jsx";
import Suppliers from "./components/suppliers/Suppliers.jsx";
import Fridges from "./components/fridges/Fridges.jsx";
import Disinfectants from "./components/disinfectants/Disinfectant.jsx";
import Fryer from "./components/fryers/Fryers.jsx";
import Rooms from "./components/rooms/Rooms.jsx";
import FoodsDiary from "./components/diaries/foods/FoodsDiary.jsx";
import Clients from "./components/clients/Clients.jsx";
import HygieneDiary from "./components/diaries/hygiene/HygieneDiary.jsx";
import PersonalHygieneDiary from "./components/diaries/personal/PersonalHygieneDiary.jsx";
import FridgeTemperatureDiary from "./components/diaries/temperatures/FridgeTemperatureDiary.jsx";
import FryerOilDiary from "./components/diaries/oil/FryerOilDiary.jsx";
import CookingTemperatureDiary from "./components/diaries/cooking/CookingTemperatureDiary.jsx";
import ProducedFoodDiary from "./components/diaries/production/ProducedFoodDiary.jsx";
import ShipmentDiary from "./components/diaries/expedition/ShipmentDiary.jsx";

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
                        <Route path="/foods" element={<FoodGroups />} />
                        <Route path="/profile" element={<UserProfile />}/>
                        <Route path="/foods" element={<FoodGroups />} />
                        <Route path="/profile/change-password" element={<ChangePassword />} />
                        <Route path="/myObjects" element={<MyObjects />}/>
                        <Route path="/myFirm" element={<MyFirm />}/>
                        <Route path="/myObject" element={<MyObject />}/>

                        <Route path="/employees" element={<Employees />} />
                        <Route path="/food-groups" element={<FoodGroups />} />
                        <Route path="/recipes" element={<Recipes />} /> 
                        <Route path="/suppliers" element={<Suppliers />} /> 
                        <Route path="/fridges" element={<Fridges />} /> 
                        <Route path="/fryers" element={<Fryer />} /> 
                        <Route path="/disinfectants" element={<Disinfectants />} /> 
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/partners" element={<Clients />} />
                        <Route path="/diaries/foods" element={<FoodsDiary />} />
                        <Route path="/diaries/hygiene" element={<HygieneDiary />} />
                        <Route path="/diaries/personal" element={<PersonalHygieneDiary />} />
                        <Route path="/diaries/temperatures" element={<FridgeTemperatureDiary />} />
                        <Route path="/diaries/oil" element={<FryerOilDiary />} />
                         <Route path="/diaries/cooking" element={<CookingTemperatureDiary />} />
                        <Route path="/diaries/production" element={<ProducedFoodDiary />} />
                        <Route path="/diaries/expedition" element={<ShipmentDiary />} />

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
