import { useContext, createContext, useState } from 'react';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  /* The Machine Spirits suggests this to check session on page load:

  useEffect(() => {
  const checkSession = async () => {
    try {
      const response = await axios.get('/check-session', { withCredentials: true });
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    }
  };

  checkSession();
}, []);

*/

  const login = (userData) => {
    setLoading(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, users, setUsers, loading, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(UserContext);
};
