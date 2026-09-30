import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('penguine_user') || localStorage.getItem('polar_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('penguine_token') || localStorage.getItem('polar_token') || null);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load demo accounts for easy switching
    fetch('/api/auth/demo-users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDemoAccounts(data.demoAccounts);
        }
      })
      .catch((err) => console.warn('Could not fetch demo accounts:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('penguine_user', JSON.stringify(userData));
    localStorage.setItem('penguine_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('penguine_user');
    localStorage.removeItem('penguine_token');
    localStorage.removeItem('polar_user');
    localStorage.removeItem('polar_token');
  };

  // 1-Click quick role switcher for demonstration and testing
  const quickSwitchRole = async (targetRole) => {
    if (targetRole === 'public') {
      logout();
      return;
    }

    const account = demoAccounts.find((a) => a.role === targetRole);
    if (account) {
      login(
        {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          department: account.department,
        },
        account.token
      );
    } else {
      // Direct login fallback
      const credentials = {
        admin: { email: 'admin@penguine.gov.in', password: 'Admin@123' },
        editor: { email: 'editor@penguine.gov.in', password: 'Editor@123' },
        scientist: { email: 'scientist@penguine.gov.in', password: 'Scientist@123' },
      }[targetRole];

      if (credentials) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();
          if (data.success) {
            login(data.user, data.token);
          }
        } catch (e) {
          console.error('Role switch failed:', e);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user ? user.role : 'public',
        login,
        logout,
        quickSwitchRole,
        demoAccounts,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
