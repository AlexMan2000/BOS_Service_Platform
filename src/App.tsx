import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/UserPages/LandingPage";
import ProtectedRoute from "./commons/auth/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "./store/slice/userSlice/userSlice";
import { AdminIndexPage } from "./pages/AdminPages/AdminIndexPage";
import { LoginPage } from "./pages/PublicPages/LoginPage";

function App() {

  const { isAuthenticated, role } = useSelector(selectUser);

  const admin_access = role === "admin"
  const auth_access = isAuthenticated

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

      
        <Route path="/admin" element={
          <ProtectedRoute
            isAuthenticated={auth_access}
            has_access={admin_access}
          >
            <AdminIndexPage />
          </ProtectedRoute>
        }>

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
