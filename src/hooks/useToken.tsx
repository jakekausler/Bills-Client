import { useState, useEffect } from 'react';

export const useToken = () => {
  const getToken = () => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      return 'auth-disabled';
    }
    return localStorage.getItem('token');
  };

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const validateToken = async () => {
    if (!token) return false;

    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      return true;
    }

    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        clearToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      clearToken();
      return false;
    }
  };

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  return { token, setToken: saveToken, clearToken, validateToken };
};
