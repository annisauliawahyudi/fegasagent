import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // Cek apakah token login ada di cookies
  const token = Cookies.get('token');

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;  // Jika ada token, tampilkan komponen yang dilindungi
};

export default ProtectedRoute;
