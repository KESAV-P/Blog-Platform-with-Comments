import { create } from 'zustand';
import api from '../utils/axios';

// Get initial state from localStorage
const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return null;
  }
};

const useAuth = create((set, get) => ({
  user: safeParse('user'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login action
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Register action
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Logout action
  logout: async () => {
    try {
      // call logout API optionally, ignore failures since token is cleared client side anyway
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout call skipped or failed:', e.message);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  // Update profile action
  updateProfile: async (data, isMultipart = false) => {
    set({ loading: true, error: null });
    try {
      const headers = isMultipart ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await api.put('/auth/profile', data, { headers });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed.';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Reset errors
  clearError: () => set({ error: null }),
}));

export default useAuth;
