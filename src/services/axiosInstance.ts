// axiosInstance.ts

import axios from "axios";
import ENDPOINT from "./config";
import {  message } from 'antd';
import store from '../store/store';
import { initUserInfo, setIsAuthenticated } from '@/store/slice/userSlice/userSlice';
// import { handleResetUserInfo } from "@/store/slices/userSlice";
import { notification } from 'antd';

const ROUTE_WHITE_LIST = [
  "/",
   "/mangrove-ai",
   "/privacy",
   "/terms-of-service",
   "/contact",
   "/about",
   "/product",
]

// Track if modal is already shown
let isModalVisible = false;
// let isConnectionErrorModalVisible = false;

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: ENDPOINT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 304;  // Accept 304 as valid
  },
  // Add timeout to detect connection issues faster
  timeout: 60000, // 60 seconds
});

// Function to check server connectivity
export const checkServerConnectivity = async () => {
  try {
    await axiosInstance.get('/health-check'); // Assuming you have a health check endpoint
    return true;
  } catch (error) {
    return false;
  }
};

// Add a request interceptor to add the token before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't add auth header for refresh token endpoint
    // if (config.url === '/api/users/refresh-token') {
    //   delete config.headers.Authorization;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network or server connectivity errors
    // if (
    //   error?.code === "ERR_NETWORK" || 
    //   error?.code === "ERR_INTERNET_DISCONNECTED" ||
    //   error?.code === "ECONNABORTED" ||
    //   !error.response
    // ) {
    //   // Only show the connection error modal if it's not already visible
    //   if (!isConnectionErrorModalVisible && window.location.pathname !== "/login/email") {
    //     isConnectionErrorModalVisible = true;
    //     Modal.error({
    //       title: 'Connection Error',
    //       content: 'Unable to connect to the server. Please check your internet connection and try again.',
    //       onOk: () => {
    //         isConnectionErrorModalVisible = false;
    //         // Optionally redirect to an error page or retry mechanism
    //         if (window.location.pathname !== "/login/email") {
    //           localStorage.clear();
    //           // Dispatch action to reset user state
    //           store.dispatch(setIsAuthenticated(false));
    //           store.dispatch(initUserInfo());
    //           window.location.href = "/login/email";
    //         }
    //       },
    //       afterClose: () => {
    //         isConnectionErrorModalVisible = false;
    //       }
    //     });
    //   }
    //   return Promise.reject(error);
    // }

    // Authentication errors (401)
    if (error.response?.status === 401 && !isModalVisible 
      && !ROUTE_WHITE_LIST.includes(window.location.pathname)
    ) {
      notification.error({
        message: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        placement: 'topRight', // or 'bottomRight'
        duration: 4.5, // seconds, 0 = never auto close
      });
      localStorage.clear();
      // Dispatch action to reset user state
      store.dispatch(setIsAuthenticated(false));
      store.dispatch(initUserInfo());

        if (!ROUTE_WHITE_LIST.includes(window.location.pathname)) {
          window.location.href = "/";
        }
        return Promise.reject(error);
    }

    // Server errors (500, etc.)
    if (error.response?.status >= 500) {
      message.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// GET 方法封装
export const getRequest = (url: string, params = {}, config = {}) => {
  return axiosInstance.get(url, {
    params,
    ...config,
  });
};

// POST 方法封装
export const postRequest = (url: string, data = {}, config = {}) => {
  return axiosInstance.post(url, data, {
    ...config,
  });
};

// PUT 方法封装
export const putRequest = (url: string, data = {}, config = {}) => {
  return axiosInstance.put(url, data, {
    ...config,
  });
};

// DELETE 方法封装
export const deleteRequest = (url: string, config = {}) => {
  return axiosInstance.delete(url, {
    ...config,
  });
};

export default axiosInstance;
