import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAccount, useConnect } from 'wagmi';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isConnected } = useAccount();
  const { status } = useConnect();

  if (status === 'pending') {
    return <div>Loading...</div>; // Affichage de quelque chose pendant le chargement, comme un spinner
  }

  if (!isConnected) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
