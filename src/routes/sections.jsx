import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const DevicePage = lazy(() => import('src/pages/device'));
export const ReadingPage = lazy(() => import('src/pages/reading'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'user/:id/device', element: <DevicePage /> },
        { path: 'reading', element: <ReadingPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },

    {
      path: 'forgot-password',
      element: <ForgotPasswordPage />,
    },
    {
      path: '/reset-password/:token',
      element: <ResetPasswordPage />,
    },
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
