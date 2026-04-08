import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
  return toast.success(message, {
    style: {
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

// Error toast
export const showError = (message) => {
  return toast.error(message, {
    style: {
      background: 'linear-gradient(to right, #ef4444, #dc2626)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

// Info toast
export const showInfo = (message) => {
  return toast(message, {
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });
};

// Warning toast
export const showWarning = (message) => {
  return toast(message, {
    icon: '⚠️',
    style: {
      background: 'linear-gradient(to right, #f59e0b, #d97706)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });
};

// Loading toast
export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });
};

// Promise toast for async operations
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong',
    style: {
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });
};
