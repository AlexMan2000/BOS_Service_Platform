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
import { RightDetailsPage } from "./pages/UserPages/RightsPages/displays/RightDetailsPage";
import { UserProfileIndexPage } from "./pages/UserPages/ProfilePages/UserProfileIndexPage";
import { UserRightsPage } from "./pages/UserPages/ProfilePages/displays/UserRightsPage";
import { UserTransactionPage } from "./pages/UserPages/ProfilePages/displays/UserTransactionPage";
import { UserManagementDetailsPage } from "./pages/AdminPages/PageComponents/UserManagementPages/displays/UserManagementDetailsPage";
import { UserListPage } from "./pages/AdminPages/PageComponents/UserManagementPages/displays/UserListPage";
import { UserManagementIndexPage } from "./pages/AdminPages/PageComponents/UserManagementPages/UserManagementIndexPage";
import { RightListPage } from "./pages/AdminPages/PageComponents/RightsManagementPages/displays/RightListPage";
import { UserProfileDetailsPage } from "./pages/UserPages/ProfilePages/displays/UserProfileDetailsPage";
import { RightManagementDetailsPage } from "./pages/AdminPages/PageComponents/RightsManagementPages/displays/RightManagementDetailsPage";



function App() {


  return (
    <BrowserRouter>
      <Routes>
        {/* 公共页面 */}
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
            <Route path="user-detail" element={<UserManagementDetailsPage />} />
          </Route>
          <Route path="rights-management" element={<RightsManagementIndexPage />} >
            <Route index element={<RightListPage />} />
            <Route path="right-detail" element={<RightManagementDetailsPage />} />
          </Route>
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
            <Route path="details" element={<RightDetailsPage />} />
          </Route>
          <Route path="profile" element={<UserProfileIndexPage />} >
            <Route index element={<UserProfileDetailsPage />} />
            <Route path="details" element={<UserProfileDetailsPage />} />
            <Route path="rights" element={<UserRightsPage />} />
            <Route path="transactions" element={<UserTransactionPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
