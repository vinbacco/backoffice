import React, { Suspense, useEffect, useState } from 'react';
import {
  BrowserRouter, Route, Routes, Navigate,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { clearUser, setUser } from 'src/redux/slices/user.slice';
import UserService from './services/api/UserService';
import './scss/style.scss';
import AppLoadingSpinner from './components/ui/AppLoadingSpinner';

// Containers
import DefaultLayout from './layout/DefaultLayout';

// Pages
import Login from './views/pages/login/Login';
import Register from './views/pages/register/Register';

function App() {
  const [appInit, setAppInit] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const userService = new UserService();
  const dispatch = useDispatch();

  useEffect(() => {
    const okGetUser = (responseUserMe) => {
      dispatch(setUser(responseUserMe.data));
      setAppInit(true);
      setIsUser(true);
    };

    const koGetUser = () => {
      dispatch(clearUser());
      window.localStorage.removeItem('authFE');
      setAppInit(true);
    };

    userService.getMe(okGetUser, koGetUser);
  }, []);

  const loading = (
    <AppLoadingSpinner />
  );

  if (appInit === false) {
    return loading;
  }
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={isUser === false ? <Login setIsUser={setIsUser} /> : <Navigate to="/dashboard" />} />
          <Route exact path="/register" name="Register Page" element={isUser === false ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="*" name="Home" element={isUser === true ? <DefaultLayout /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
