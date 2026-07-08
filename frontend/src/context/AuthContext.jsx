import React, { createContext, useState, useEffect } from 'react';
import API, { registerUnauthorizedCallback } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync token checks on mount or active profile refreshes
  useEffect(() => {
    registerUnauthorizedCallback(() => {
      setUser((prevUser) => {
        if (prevUser !== null) {
          toast.error('Session expired. Please log in again.');
        }
        return null;
      });
    });

    if (user) {
      fetchUserProfile();
    }

    return () => {
      registerUnauthorizedCallback(null);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}! 🔥`);
      return { success: true };
    } catch (error) {
      let msg = 'Login failed. Please try again.';
      if (error.response) {
        msg = error.response.data?.message || msg;
      } else if (error.request) {
        msg = 'Network Error: Server is unreachable. Please check if your backend is running.';
      } else {
        msg = error.message || msg;
      }
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`Account created successfully! Welcome ${name}! 👋`);
      return { success: true };
    } catch (error) {
      let msg = 'Registration failed. Please try again.';
      if (error.response) {
        msg = error.response.data?.message || msg;
      } else if (error.request) {
        msg = 'Network Error: Server is unreachable. Please check if your backend is running.';
      } else {
        msg = error.message || msg;
      }
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully. See you soon! 👋');
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      // Merge retrieved profile details with local storage token details
      setUser((prev) => {
        const merged = { ...prev, ...data };
        localStorage.setItem('userInfo', JSON.stringify(merged));
        return merged;
      });
    } catch (error) {
      console.error('Failed to sync profile status:', error.message);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', profileData);
      setUser((prev) => {
        const merged = { ...prev, ...data };
        localStorage.setItem('userInfo', JSON.stringify(merged));
        return merged;
      });
      toast.success('Profile updated successfully! ✨');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Profile update failed.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchUserProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
