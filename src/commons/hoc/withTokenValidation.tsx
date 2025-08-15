import React, { useEffect } from 'react';
import { Modal } from 'antd';
import store from '@/store/store';
import { initUserInfo } from '@/store/slice/userSlice/userSlice';
import axios from 'axios';
import ENDPOINT from '@/services/config';

let isModalVisible = false;
let isValidatingToken = false;

const validateToken = async () => {
  if (isValidatingToken) return true;
  
  try {
    isValidatingToken = true;
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    const response = await axios.post(
      `${ENDPOINT}/api/users/validate-token`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  } finally {
    isValidatingToken = false;
  }
};

const handleInvalidToken = () => {
  localStorage.removeItem("access_token");
  store.dispatch(initUserInfo());
  
  if (!isModalVisible) {
    isModalVisible = true;
    Modal.error({
      title: 'Session Expired',
      content: 'Your session has expired. Please log in again.',
      onOk: () => {
        isModalVisible = false;
        window.location.href = '/login/email';
      }
    });
  }
};

export const withTokenValidation = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithTokenValidationComponent(props: P) {
    useEffect(() => {
      const handleGlobalClick = async () => {
        console.log("Global click detected");
        const isValid = await validateToken();
        if (!isValid) {
          handleInvalidToken();
        }
      };

      // Add click listener to document
      console.log("Adding click listener");
      document.addEventListener('click', handleGlobalClick);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleGlobalClick);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
}; 