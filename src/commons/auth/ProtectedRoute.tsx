import { selectUser } from '@/store/slice/userSlice/userSlice';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({ isAuthenticated, has_access, children }) => {
  return isAuthenticated ? 
  has_access?
  <Navigate to="/access-denied" replace></Navigate>:
  children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
