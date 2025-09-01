// axiosInstance.ts

import axios from "axios";
import ENDPOINT from "./config";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: ENDPOINT,
  withCredentials: false,
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
