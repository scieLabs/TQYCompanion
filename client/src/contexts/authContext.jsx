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

  useEffect(() => {
    console.log('AuthContext: Fetching user session...');
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
        if (!token || token === 'undefined') {
          console.error('Invalid or missing token in localStorage.');
          console.log('JWT Token:', localStorage.getItem('token'));
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/users/check-session`, {
          headers: { Authorization: `Bearer ${token}` }, // Send the token in the Authorization header
          withCredentials: true,
        });

        if (response.data.authenticated) {
          setUser(response.data.user); // Set the user object from the response
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user session:', err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetching user from database //FIXME: old version
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/users/check-session`, { withCredentials: true });
  //       if (response.data.authenticated) {
  //         setUser(response.data.user);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching user session:', err);
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, credentials, {
        withCredentials: true,
      });
      const { user, token } = response.data;

      if (!token) {
        console.error('No token received from the backend.');
        throw new Error('Login failed: No token received.');
      }
  
      console.log('Login successful. Token:', token); // Debugging: Log the token
      console.log('User object:', user); // Debugging: Log the user object

      localStorage.setItem('token', token); // Store the JWT token
      localStorage.setItem('user', JSON.stringify(user)); // Persist user in localStorage
      setUser(user); // Set the user object
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //FIXME: old version
//   const login = async (credentials) => {
//     setLoading(true);
//     setError(null);
//     try {
//         const response = await axios.post(`${API_BASE_URL}/users/login`, credentials, { withCredentials: true });
//         setUser(response.data.user); // Assuming the backend returns user details
//         localStorage.setItem('user', JSON.stringify(response.data.user)) // FIXME: Copilot says: Persist user in localStorage
//         localStorage.setItem('token', response.data.token); // Store the token
//     } catch (err) {
//         console.error('Login failed:', err.response?.data || err.message);
//         setError(err.response?.data?.message || 'Login failed. Please try again.');
//         throw err; // Re-throw the error to handle it in Login.jsx
//     } finally {
//         setLoading(false);
//     }
// };

const logout = async () => {
    setLoading(true);
    try {
        await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
        setUser(null);
        localStorage.removeItem('user'); // Clear user from localStorage
        localStorage.removeItem('token'); // Clear token or other persisted data
    } catch (err) {
        console.error('Logout failed:', err.response?.data || err.message);
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
