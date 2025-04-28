import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ORIGIN_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
  
    const navigate = useNavigate();
  
    useEffect(() => {
        const checkSession = async () => {
            try {
              const response = await axios.get(
                `${ORIGIN_URL}/api/v1/users/check-session`,
                {
                  withCredentials: true,
                }
              );

              if (response.data.authenticated) {
                setUser(response.data.user);
                
              } else {
                setUser(null);
            }
            } catch (error) {
              console.error('Error checking session:', error);
              setUser(null);
            }
          };
          checkSession();
    }, []);
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post(
          `${ORIGIN_URL}/api/v1/users/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        navigate('/NewGame'); // Navigate to /posts on successful login
        } catch (error) {
        setMessage(error.response?.data?.message || 'Login was unsuccessful :c .');
    }
  };
    const handleLogout = async () => {
        try {
            await axios.post(
                `${ORIGIN_URL}/api/v1/users/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            setMessage('Logout successful!');
        } catch (error) {
            setMessage('Logout failed');
        }
    };


};