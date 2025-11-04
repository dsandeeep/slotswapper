import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('=== LOGIN FUNCTION CALLED ===');
      console.log('Email:', email);
      
      const { data } = await API.post('/auth/login', { email, password });
      
      console.log('✅ Login successful');
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error('❌ LOGIN ERROR:', err);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log('=== AuthContext: SIGNUP FUNCTION CALLED ===');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password length:', password.length);
      
      console.log('Sending request to: http://localhost:5000/api/auth/signup');
      console.log('Request data:', { name, email, password });
      
      const { data } = await API.post('/auth/signup', { 
        name,      // ✅ FIXED - was "username" before
        email, 
        password 
      });
      
      console.log('✅ Signup successful');
      console.log('Received token:', data.token ? 'Yes' : 'No');
      console.log('Received user:', data.user);
      
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error('=== SIGNUP ERROR IN AUTHCONTEXT ===');
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.message);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
