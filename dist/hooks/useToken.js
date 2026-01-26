import { useState, useEffect } from 'react';
export const useToken = () => {
    const getToken = () => {
        return localStorage.getItem('token');
    };
    const [token, setToken] = useState(getToken());
    const saveToken = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };
    const clearToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
    const validateToken = async () => {
        if (!token)
            return false;
        try {
            const response = await fetch('/api/auth/validate', {
                headers: {
                    Authorization: token,
                },
            });
            console.log(response);
            if (!response.ok) {
                clearToken();
                return false;
            }
            return true;
        }
        catch (error) {
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
