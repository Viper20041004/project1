import HomePage from '../pages/HomePage/HomePage';
import SignInPage from '../pages/SignInPage/SignInPage';

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
];

export default routes;
