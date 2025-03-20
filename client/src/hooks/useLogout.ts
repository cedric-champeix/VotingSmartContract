import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

export const useLogout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const { disconnect } = useDisconnect();

  const logout = async () => {
    try {
      setLoading(true);
      disconnect();
    } catch (err: any) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
      navigate('/login');
    }
  };

  return { logout, loading };
};
