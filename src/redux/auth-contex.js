// redux/auth-contex.js (make sure file name matches)
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2';
import { setLogin } from './features/dashboardSlice';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token,user) => {},
  logout: () => {},
  loading: true,
});

export const AuthContextProvider = (props) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Track auth check

  const userIsLoggedIn = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      dispatch(setLogin(true));
    } else {
      dispatch(setLogin(false));
    }
    setLoading(false); // 👈 Done checking
  }, [dispatch]);

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(setLogin(false));
    Swal.fire('Logged out!', 'See you soon', 'success');
  };

  const loginHandler = (token,user) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user))
    dispatch(setLogin(true));
  };

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
