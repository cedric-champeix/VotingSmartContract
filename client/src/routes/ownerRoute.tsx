import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import useIsOwner from '@/hooks/useIsOwner';
import { ForbiddenPage } from '@/pages/ForbiddenPage';

interface OwnerRouteProps {
  children: ReactNode;
}

export const OwnerRoute = ({ children }: OwnerRouteProps) => {
  const { isConnected } = useAccount();
  const { data: isOwner, isLoading } = useIsOwner();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isConnected || !isOwner) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
};
