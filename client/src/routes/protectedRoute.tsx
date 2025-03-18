import { Navigate } from 'react-router-dom';
import { useWeb3 } from '@/hooks/useWeb3';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { account, loading } = useWeb3();

  if (loading) {
    return <div>Loading...</div>; // Affichage de quelque chose pendant le chargement, comme un spinner
  }

  if (!account) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
