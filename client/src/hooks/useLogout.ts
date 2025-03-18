import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useLogout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('account');
    } catch (err: any) {
      console.error('Error loging out:', err);
    } finally {
      setLoading(false);
      navigate('/login');
    }
  };

  return { logout, loading };
};
