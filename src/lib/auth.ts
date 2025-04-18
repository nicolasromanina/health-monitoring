
import { atom } from 'jotai';
import { Storage } from '@capacitor/storage';

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
  await Storage.set({ key: 'auth_token', value: token });
};

export const getAuthToken = async (): Promise<string | null> => {
  const { value } = await Storage.get({ key: 'auth_token' });
  return value;
};

export const removeAuthToken = async () => {
  await Storage.remove({ key: 'auth_token' });
};

export const storeUserData = async (user: User) => {
  await Storage.set({ key: 'user', value: JSON.stringify(user) });
};

export const getUserData = async (): Promise<User | null> => {
  const { value } = await Storage.get({ key: 'user' });
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const removeUserData = async () => {
  await Storage.remove({ key: 'user' });
};
