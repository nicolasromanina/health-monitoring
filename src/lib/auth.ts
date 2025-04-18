
import { atom } from 'jotai';
import { Preferences } from '@capacitor/preferences';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

export const authAtom = atom<AuthState>(initialAuthState);

// Auth utilities
export const storeAuthToken = async (token: string) => {
  await Preferences.set({ key: 'auth_token', value: token });
};

export const getAuthToken = async (): Promise<string | null> => {
  const { value } = await Preferences.get({ key: 'auth_token' });
  return value;
};

export const removeAuthToken = async () => {
  await Preferences.remove({ key: 'auth_token' });
};

export const storeUserData = async (user: User) => {
  await Preferences.set({ key: 'user', value: JSON.stringify(user) });
};

export const getUserData = async (): Promise<User | null> => {
  const { value } = await Preferences.get({ key: 'user' });
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const removeUserData = async () => {
  await Preferences.remove({ key: 'user' });
};

// Mock authentication functions
export const loginUser = async (email: string, password: string): Promise<{ token: string, user: User }> => {
  // This is a mock implementation - in a real app, this would call your API
  if (email === 'demo@example.com' && password === 'password') {
    const mockUser: User = {
      id: 'user-1',
      username: 'demouser',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://i.pravatar.cc/150?u=demouser'
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      token: 'mock-jwt-token',
      user: mockUser
    };
  }
  
  throw new Error('Invalid credentials');
};

export const registerUser = async (username: string, email: string, password: string): Promise<{ token: string, user: User }> => {
  // This is a mock implementation - in a real app, this would call your API
  
  // Check if email already exists (mock validation)
  if (email === 'demo@example.com') {
    throw new Error('Email already registered');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser: User = {
    id: `user-${Math.floor(Math.random() * 1000)}`,
    username,
    email,
    name: username,
  };
  
  return {
    token: 'mock-jwt-token-new-user',
    user: mockUser
  };
};
