import { useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAnyChangeOnCurrentPage } from '@/store/slice/globalSlice/globalSlice';

export const useNavigationConfirm = (
  shouldConfirm: boolean = true,  
  state={},
  sideEffect: () => Promise<void> = async () => {},
  protectedPaths: string[] 
  = [
    '/visual/projects/annotate'
  ],
 ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;


  const isProtectedPath = useCallback(() => {
    return protectedPaths.some(path => currentPath.startsWith(path));
  }, [currentPath, protectedPaths]);

  const handleNavigation = useCallback(async (targetPath: string) => {
    // Only show confirmation if we're on a protected path and confirmation is enabled
    if (!shouldConfirm || !isProtectedPath()) {
      // jump logic
      await sideEffect();
      navigate(targetPath, { state: state });
      dispatch(setAnyChangeOnCurrentPage(false));
      return;
    }

    Modal.confirm({
      title: 'Confirm Navigation',
      content: 'Are you sure you want to leave this page? Your progress may not be saved.',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: {
        style: { backgroundColor: "#1890ff", color: "white", borderColor: "#1890ff" }, // Custom style for OK button
      },
      cancelButtonProps: {
        style: { backgroundColor: "gray", color: "white", borderColor: "gray" }, // Custom style for Cancel button
      },
      onOk: async () => {
        // jump logic
        await sideEffect();
        navigate(targetPath, { state: state });
        dispatch(setAnyChangeOnCurrentPage(false));
      },
      onCancel: () => {
        // Stay on current page
      },
    });
  }, [navigate, currentPath, shouldConfirm, isProtectedPath, state]);

  // Handle browser back/forward buttons and manual URL changes
  useEffect(() => {
    if (!shouldConfirm || !isProtectedPath()) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldConfirm, isProtectedPath]);

  return handleNavigation;
}