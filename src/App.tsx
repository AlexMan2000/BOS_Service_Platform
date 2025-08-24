import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/UserPages/LandingPage";
import ProtectedRoute from "./commons/auth/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "./store/slice/userSlice/userSlice";
import { AdminIndexPage } from "./pages/AdminPages/AdminIndexPage";
import { LoginPage } from "./pages/PublicPages/LoginPage";
import { RightsManagementIndexPage } from "./pages/AdminPages/PageComponents/RightsManagementPages/RightsManagementIndexPage";
import { ActivitiesManagementIndexPage } from "./pages/AdminPages/PageComponents/ActivitiesManagementPages/ActivitiesManagementIndexPage";
import { ActivityIndexPage } from "./pages/UserPages/ActivityPages/ActiviryIndexPage";
import { RightsIndexPage } from "./pages/UserPages/RightsPages/RightsIndexPage";
import { ActivityGridPage } from "./pages/UserPages/ActivityPages/displays/ActivityGridPage";
import { ProjectGridPage } from "./pages/UserPages/ActivityPages/displays/ProjectGridPage";
import { ProjectDetailPage } from "./pages/UserPages/ActivityPages/displays/ProjectDetailPage";
import { RightsGridPage } from "./pages/UserPages/RightsPages/displays/RightsGridPage";
import { RightDetailPage } from "./pages/UserPages/RightsPages/displays/RightDetailPage";
import { UserProfileIndexPage } from "./pages/UserPages/ProfilePages/UserProfileIndexPage";
import { UserRightsPage } from "./pages/UserPages/ProfilePages/displays/UserRightsPage";
import { UserTransactionPage } from "./pages/UserPages/ProfilePages/displays/UserTransactionPage";
import { UserDetailsPage } from "./pages/AdminPages/PageComponents/UserManagementPages/displays/UserDetailsPage";
import { UserListPage } from "./pages/AdminPages/PageComponents/UserManagementPages/displays/UserListPage";
import { UserManagementIndexPage } from "./pages/AdminPages/PageComponents/UserManagementPages/UserManagementIndexPage";




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
          <Route path="" element={<Navigate to="user-management" />} />
          <Route path="user-management" element={<UserManagementIndexPage />} >
            <Route index element={<UserListPage />} />
            <Route path="user-detail" element={<UserDetailsPage />} />
          </Route>
          <Route path="rights-management" element={<RightsManagementIndexPage />} />
          <Route path="activities-management" element={<ActivitiesManagementIndexPage />} />
        </Route>

        {/* 用户页面 */}
        <Route path="/home" element={
          <ProtectedRoute
            login_required={true}
            admin_required={false}
          >
            <LandingPage />
          </ProtectedRoute>
        }>
          <Route path="" element={<Navigate to="activities" />} />
          <Route path="activities" element={<ActivityIndexPage />} >
            <Route index element={<ActivityGridPage />} />
            <Route path="projects" element={<ProjectGridPage />} />
            <Route path="projects/detail" element={<ProjectDetailPage  />} />
          </Route>
          <Route path="rights" element={<RightsIndexPage />} >
            <Route index element={<RightsGridPage />} />
            <Route path="detail" element={<RightDetailPage />} />
          </Route>
          <Route path="profile" element={<UserProfileIndexPage />} >
            <Route index element={<UserDetailsPage />} />
            <Route path="details" element={<UserDetailsPage />} />
            <Route path="rights" element={<UserRightsPage />} />
            <Route path="transactions" element={<UserTransactionPage />} />
          </Route>
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
