// src/contexts/UserContext.tsx
import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

interface UserContextType {
  avatar: string;
  username: string;
  setAvatar: (avatar: string) => void;
  setUsername: (username: string) => void;
  resetUser: () => void;
  initializeUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  avatar: '👤',
  username: '',
  setAvatar: () => {},
  setUsername: () => {},
  resetUser: () => {},
  initializeUser: async () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatar, setAvatar] = useState('👤');
  const [username, setUsername] = useState('');

  const resetUser = () => {
    setAvatar('👤');
    setUsername('');
  };

  const initializeUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.avatar) {
        setAvatar(response.data.avatar);
      }
      if (response.data.username) {
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error('Failed to fetch initial user data');
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      avatar, 
      setAvatar, 
      username, 
      setUsername, 
      resetUser,
      initializeUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};