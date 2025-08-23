import { selectUser } from '@/store/slice/userSlice/userSlice';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({ login_required, admin_required, children }) => {

  // const { isAuthenticated, role } = useSelector(selectUser);

  const loggedIn = true
  const isAdmin = true

  if ( admin_required && !login_required ) {
    throw new Error("admin_required cannot be true when login_required is false")
  }



  /**
   * 如果需要登录
   * 如果用户登录了,判断用户是否有权限
   * 如果用户有权限，则返回对应组件
   * 如果用户没有权限，则返回access-denied页面
   * 如果用户没有登录，则跳转到login
   * 如果不需要登录，则直接返回子组件
   */

  if (login_required) {
    if (loggedIn) {
      if (admin_required) {
        if (isAdmin) {
          return children
        }
        else {
          return <Navigate to="/access-denied" replace />
        }
      }
      else {
        return children
      }
    }
    else {
      return <Navigate to="/login" replace />
    }
  }
  else {
    return children
  }

};

export default ProtectedRoute;
