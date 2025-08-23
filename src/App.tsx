import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/UserPages/LandingPage";
import ProtectedRoute from "./commons/auth/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "./store/slice/userSlice/userSlice";
import { AdminIndexPage } from "./pages/AdminPages/AdminIndexPage";
import { LoginPage } from "./pages/PublicPages/LoginPage";
import { UserManagementIndexPage } from "./pages/AdminPages/PageComponents/UserManagementPages/UserManagementIndexPage";
import { RightsManagementIndexPage } from "./pages/AdminPages/PageComponents/RightsManagementPages/RightsManagementIndexPage";
import { ActivitiesManagementIndexPage } from "./pages/AdminPages/PageComponents/ActivitiesManagementPages/ActivitiesManagementIndexPage";
import { UserDetailPage } from "./pages/AdminPages/PageComponents/UserManagementPages/UserDetailPage";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 管理员页面 */}
        <Route path="/admin" element={
          <ProtectedRoute
            login_required={true}
            admin_required={true}
          >
            <AdminIndexPage />
          </ProtectedRoute>
        }>
          <Route path="user-management" element={<UserManagementIndexPage />} >
            <Route path="user-detail" element={<UserDetailPage />} />
          </Route>
          <Route path="rights-management" element={<RightsManagementIndexPage />} />
          <Route path="activities-management" element={<ActivitiesManagementIndexPage />} />
        </Route>


        {/* 用户页面 */}
        {/* <Route path="/profile" element={
          <ProtectedRoute
            login_required={true}
            admin_required={false}
          >
            <UserIndexPage />
          </ProtectedRoute>
        }></Route> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
