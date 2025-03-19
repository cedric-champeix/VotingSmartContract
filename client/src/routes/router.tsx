import { ErrorPage } from '../pages/ErrorPage';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '@/components/Footer';
import LoginPage, { Login } from '@/pages/Authentication/Login';
import { Home } from '@/pages/Home';
import { ProtectedRoute } from './protectedRoute';
import {About} from "@/pages/About";
import {Vote} from "@/pages/Vote/Vote";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
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
        element: <About/>,
      },
      {
        path: '/vote',
        element: <Vote/>
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
