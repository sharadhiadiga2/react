import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RoleBasedRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserRole('guest');
          setLoading(false);
          return;
        }

        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API}/api/auth/me`, {
          headers: { 'x-auth-token': token }
        });
        
        const role = response.data.role;
        setUserRole(role);
        localStorage.setItem('userRole', role);
      } catch (error) {
        console.error('Error checking user role:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUserRole('guest');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (userRole === 'guest' || !userRole) {
    return <Navigate to="/login" replace />;
  } else if (userRole === 'sales' || userRole === 'admin') {
    return <Navigate to="/sales" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
};

export default RoleBasedRedirect;
