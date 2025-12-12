import HomePage from '../pages/HomePage/HomePage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import SignInPage from '../pages/SignInPage/SignInPage';

import DashboardPage from '../pages/DashboardPage/DashboardPage';

const routes = [
  {
    path: '/',
    element: <HomePage />,
    isShowHeader: true,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
    isShowHeader: false,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    isShowHeader: false,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    isShowHeader: true,
  },
];

export default routes;
