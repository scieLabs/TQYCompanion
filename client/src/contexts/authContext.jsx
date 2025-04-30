import { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);   //TODO: Check out later, copilot says this should be "true" but we originally had it as "false"
  const [error, setError] = useState(null);
  console.log('AuthProvider initialized:', { user });

  // Fetching user from database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/check-session`, { withCredentials: true });
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, credentials, { withCredentials: true });
        setUser(response.data.user); // Assuming the backend returns user details
        localStorage.setItem('user', JSON.stringify(response.data.user)) // FIXME: Copilot says: Persist user in localStorage
        localStorage.setItem('token', response.data.token); // Store the token
    } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Login failed. Please try again.');
        throw err; // Re-throw the error to handle it in Login.jsx
    } finally {
        setLoading(false);
    }
};

const logout = async () => {
    setLoading(true);
    try {
        await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
        setUser(null);
        localStorage.removeItem('user'); // Clear user from localStorage
        localStorage.removeItem('token'); // Clear token or other persisted data
    } catch (err) {
        setError('Logout failed. Please try again.');
        throw err; // Re-throw the error to handle it in Logout.jsx
    } finally {
        setLoading(false);
    }
};

 //TODO: Old version 
//   const login = async (credentials) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Replace with your backend API endpoint
//       const response = await fetch(`${API_BASE_URL}/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         throw new Error('Login failed. Please check your credentials.');
//       }

//       const data = await response.json();
//       setUser(data.user); // Assuming the backend returns user details
//       // Optionally persist token or user data
//       localStorage.setItem('token', data.token); // Example for token storage
//     } catch (err) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const logout = async () => {
//     setLoading(true);
//     try {
//       // Replace with your backend API endpoint (if logout requires a backend call)
//       await fetch('/logout', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
//       });

//       setUser(null);
//       setUsers(null);
//       localStorage.removeItem('token'); // Clear token or other persisted data
//     } catch (err) {
//       setError('Logout failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <UserContext.Provider
      value={{ user, setUser, users, setUsers, loading, error, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
