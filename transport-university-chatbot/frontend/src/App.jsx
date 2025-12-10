import React, { Fragment } from 'react'
import routes from './router/index.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultComponent from './components/DefaultComponent/DefaultComponent.jsx'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authService } from './services/api'
import { loginSuccess, loginFailure } from './redux/slide/userSlide'
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            console.log("Token expired, clearing storage");
            localStorage.removeItem('access_token');
            return;
          }

          console.log("Found token, restoring session...");
          const userDetails = await authService.getMe(token);
          console.log("Session restored:", userDetails.data);
          dispatch(loginSuccess({ ...userDetails.data, access_token: token }));
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem('access_token');
          dispatch(loginFailure("Session expired"));
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    {route.element}
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}
export default App