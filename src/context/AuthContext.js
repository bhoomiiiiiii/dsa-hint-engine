import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dsa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const signup = (username, password) => {
    const users = JSON.parse(localStorage.getItem('dsa_users') || '{}');
    if (users[username]) return { error: 'Username already exists' };
    const newUser = {
      username,
      password,
      joinedAt: new Date().toISOString(),
      streak: 0,
      lastSolved: null,
      totalSolved: 0,
      xp: 0,
    };
    users[username] = newUser;
    localStorage.setItem('dsa_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('dsa_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('dsa_users') || '{}');
    if (!users[username]) return { error: 'User not found' };
    if (users[username].password !== password) return { error: 'Wrong password' };
    const { password: _, ...safeUser } = users[username];
    setUser(safeUser);
    localStorage.setItem('dsa_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dsa_user');
  };

  const updateUser = (updates) => {
    const users = JSON.parse(localStorage.getItem('dsa_users') || '{}');
    if (user && users[user.username]) {
      const updated = { ...users[user.username], ...updates };
      users[user.username] = updated;
      localStorage.setItem('dsa_users', JSON.stringify(users));
      const { password: _, ...safeUser } = updated;
      setUser(safeUser);
      localStorage.setItem('dsa_user', JSON.stringify(safeUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
