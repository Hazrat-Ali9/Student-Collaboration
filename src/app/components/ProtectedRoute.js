// components/ProtectedRoute.js
"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/redux/auth-contex';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, router]);

  if (loading || (!loading && !isLoggedIn)) return null; // Wait or block

  return children;
};

export default ProtectedRoute;
