import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducers'

interface UserState {
  auto_renewal: boolean | null
  avatar: string
  user_id: string
  email: string
  inbox_email: string | null
  email_verified: boolean | null
  first_name: string
  last_name: string
  company_name: string
  employee_id: string
  industry_field: string
  has_free_tried: boolean | null
  has_subscribed: boolean | null
  subscription_end_date: string | null
  subscription_start_date: string | null
  subscription_type: string
  points: number
  page_status: string
  isAuthenticated: boolean
  access_token: string | null
  geo_location: string
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
  auto_renewal: null,
  geo_location: '',
  avatar: '',
  user_id: '',
  email: '',
  inbox_email: '',
  email_verified: null,
  first_name: '',
  last_name: '',
  company_name: '',
  employee_id: '',
  industry_field: '',
  has_free_tried: null,
  has_subscribed: null,
  subscription_end_date: null,
  subscription_start_date: null,
  subscription_type: '',
  points: 0,
  page_status: 'profile',
  isAuthenticated: getUserLoginStatus(),
  access_token: getAccessToken(),
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserState>) => {
      state.auto_renewal = action.payload.auto_renewal
      state.avatar = action.payload.avatar
      state.user_id = action.payload.user_id
      state.email = action.payload.email
      state.inbox_email = action.payload.inbox_email
      state.email_verified = action.payload.email_verified
      state.first_name = action.payload.first_name
      state.has_free_tried = action.payload.has_free_tried
      state.has_subscribed = action.payload.has_subscribed
      state.last_name = action.payload.last_name
      state.geo_location = action.payload.geo_location
      state.company_name = action.payload.company_name
      state.employee_id = action.payload.employee_id
      state.industry_field = action.payload.industry_field
      state.subscription_end_date = action.payload.subscription_end_date
      state.subscription_start_date = action.payload.subscription_start_date
      state.subscription_type = action.payload.subscription_type
      state.points = action.payload.points
      state.access_token = action.payload.access_token
    },
    initUserInfo: (state) => {
      state.auto_renewal = null
      state.avatar = ''
      state.user_id = ''
      state.email = ''
      state.inbox_email = null
      state.email_verified = null
      state.first_name = ''
      state.has_free_tried = null
      state.has_subscribed = null
      state.last_name = ''
      state.geo_location = ''
      state.industry_field = ''
      state.subscription_end_date = null
      state.subscription_start_date = null
      state.subscription_type = ''
      state.points = 0
      state.access_token = null
      state.isAuthenticated = false,
      localStorage.removeItem('access_token')
      localStorage.removeItem('isAuthenticated')
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload
      localStorage.setItem('access_token', action.payload)
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },

    updatePageStatus: (state, action: PayloadAction<string>) => {
      state.page_status = action.payload
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
  updatePageStatus, 
  setIsAuthenticated,
  setAccessToken,
  setUserId,
  setUserEmail,
} =
  userSlice.actions


export default userSlice.reducer