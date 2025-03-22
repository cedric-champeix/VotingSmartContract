import { ErrorPage } from '../pages/ErrorPage';
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '@/components/Footer';
import LoginPage from '@/pages/Authentication/Login';
import { Home } from '@/pages/Home';
import { ProtectedRoute } from './protectedRoute';
import { About } from '@/pages/About';
import { Vote } from '@/pages/Vote/Vote';
import { useAccount } from 'wagmi';
import AdminDashboard from '@/pages/Admin/AdminDashboard';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const LoginRedirect = () => {
  const { isConnected } = useAccount();

  // If the user is connected, redirect them to the home page
  if (isConnected) {
    return <Navigate to='/' replace />;
  }

  // If not connected, show the Login page
  return <LoginPage />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/vote',
        element: <Vote />,
      },
      {
        path: '/admin',
        element: <AdminDashboard />,
      }
    ],
  },
  {
    path: '/login',
    element: <LoginRedirect />,
  },
]);
