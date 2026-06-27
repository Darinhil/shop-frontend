import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';
import { useToast } from '../composables/useToast';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = ref(false);
  const { success, error: toastError } = useToast();

  // Keep auth state in sync with localStorage
  const syncAuthState = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    token.value = storedToken;
    isAuthenticated.value = !!storedToken;

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        user.value = null;
      }
    } else {
      user.value = null;
    }
  };

  // Initialize auth state from localStorage
  const initAuth = () => {
    syncAuthState();
  };

  const setAuthenticatedSession = (session) => {
    token.value = session.token;
    user.value = session.user;
    isAuthenticated.value = true;

    localStorage.setItem('auth_token', session.token);
    localStorage.setItem('auth_user', JSON.stringify(session.user));
  };

  const loginUser = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);

      // Persist first so axios interceptor can attach it to any follow-up requests
      localStorage.setItem('auth_token', response.data.token);

      // Prefer fetching the canonical user from backend (sanctum-guarded)
      // This also verifies the token works.
      const profileResponse = await api.get('/user');
      setAuthenticatedSession({
        token: response.data.token,
        user: profileResponse.data
      });

      success('Welcome back! Login successful.');
      return { token: response.data.token, user: profileResponse.data };
    } catch (error) {
      // On any auth-related failure, clear potentially bad token
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      toastError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await api.post('/register', userData);

      setAuthenticatedSession({
        token: response.data.token,
        user: response.data.user
      });

      success('Account created. You are now logged in.');
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/logout');
      success('Logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user');
      user.value = response.data;
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/user', profileData);
      user.value = response.data;
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to update profile.');
      throw error;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await api.put('/password', passwordData);
      success('Password changed successfully!');
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to change password.');
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    initAuth,
    loginUser,
    registerUser,
    logoutUser,
    fetchProfile,
    updateProfile,
    updatePassword
  };
});
