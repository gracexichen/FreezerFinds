import { toast, Zoom } from 'react-toastify';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Zoom
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Zoom
  });
};
