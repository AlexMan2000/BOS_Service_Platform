import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducers'

interface UserState {
  // Basic user info
  employeeNo: string // 工号
  // accountId: number // 账号id
  phone: string; // 手机号
  name: string; // 姓名
  department: string; // 部门
  createdTime: string; // 注册时间
  createdBy: string; // 经办人 
  lastLogin: string; // 上一次登录时间
  balance: string; // 稳定余额
  
  // Role and authentication
  role: string; // User role
  isAuthenticated: boolean;
  access_token: string | null;
}

const getUserLoginStatus = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (isAuthenticated === 'true') {
    return true
  }
  return false
  }
  
const getAccessToken = () => {
  const access_token = localStorage.getItem('access_token')
  if (access_token) {
    return access_token
  }
  return null
}

const initialState: UserState = {
  // Basic user info
  employeeNo: '',
  // accountId: 0,
  phone: '',
  name: '',
  department: '',
  createdTime: '',
  createdBy: '',
  lastLogin: '',
  balance: '',
  
  // Role and authentication
  role: 'user',
  isAuthenticated: getUserLoginStatus(),
  access_token: getAccessToken(),
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Partial<UserState>>) => {
      // Update only the properties that are provided in the payload
      Object.assign(state, action.payload)
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload
    },
    initUserInfo: (state) => {
      // Reset basic user info
      state.employeeNo = ''
      // state.accountId = 0,
      state.phone = '',
      state.name = ''
      state.department = ''
      state.createdTime = ''
      state.createdBy = ''
      state.lastLogin = ''
      state.balance = ''
      
      // Reset role and authentication
      state.role = 'user'
      state.isAuthenticated = false
      state.access_token = null
      
      // Clear localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('isAuthenticated')
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload
      localStorage.setItem('access_token', action.payload)
    },

    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      localStorage.setItem('isAuthenticated', action.payload.toString())
      state.isAuthenticated = action.payload
    },
  },
})
export const selectUser = (state: RootState) => state.user

export const { 
  setUserInfo, 
  initUserInfo, 
  setIsAuthenticated,
  setAccessToken,
  setUserRole,
} =
  userSlice.actions


export default userSlice.reducer