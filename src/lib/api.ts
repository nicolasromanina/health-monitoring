
import { toast } from '@/components/ui/use-toast';
import { User } from './auth';

// Mock API base URL - would be replaced with a real API in production
const API_BASE_URL = 'https://api.vitalsync.example/v1';

// Mock data
export interface HealthMetric {
  id: string;
  type: 'heart_rate' | 'steps' | 'sleep' | 'calories' | 'oxygen';
  value: number;
  unit: string;
  timestamp: string;
  deviceId?: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  batteryLevel?: number;
  lastSync?: string;
}

// Mock health data
const mockHealthData: Record<string, HealthMetric[]> = {
  'heart_rate': Array(24).fill(0).map((_, i) => ({
    id: `hr-${i}`,
    type: 'heart_rate',
    value: Math.floor(Math.random() * 30) + 60, // Random between 60-90
    unit: 'bpm',
    timestamp: new Date(Date.now() - i * 3600000).toISOString()
  })),
  'steps': Array(7).fill(0).map((_, i) => ({
    id: `steps-${i}`,
    type: 'steps',
    value: Math.floor(Math.random() * 5000) + 3000, // Random between 3000-8000
    unit: 'steps',
    timestamp: new Date(Date.now() - i * 86400000).toISOString()
  })),
  'sleep': Array(7).fill(0).map((_, i) => ({
    id: `sleep-${i}`,
    type: 'sleep',
    value: Math.floor(Math.random() * 3) + 5, // Random between 5-8
    unit: 'hours',
    timestamp: new Date(Date.now() - i * 86400000).toISOString()
  })),
  'calories': Array(7).fill(0).map((_, i) => ({
    id: `cal-${i}`,
    type: 'calories',
    value: Math.floor(Math.random() * 500) + 1500, // Random between 1500-2000
    unit: 'kcal',
    timestamp: new Date(Date.now() - i * 86400000).toISOString()
  })),
  'oxygen': Array(24).fill(0).map((_, i) => ({
    id: `ox-${i}`,
    type: 'oxygen',
    value: Math.floor(Math.random() * 3) + 96, // Random between 96-99
    unit: '%',
    timestamp: new Date(Date.now() - i * 3600000).toISOString()
  }))
};

// Mock devices
const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Fitbit Charge 5',
    type: 'Fitness Tracker',
    connected: true,
    batteryLevel: 78,
    lastSync: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  },
  {
    id: 'device-2',
    name: 'Apple Watch Series 7',
    type: 'Smartwatch',
    connected: false,
    batteryLevel: 45,
    lastSync: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// Mock user
const mockUser: User = {
  id: 'user-1',
  username: 'johndoe',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
};

// API utility
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  return await response.json() as T;
};

// Mock API requests with artificial delay
const mockApiRequest = <T>(data: T, delay: number = 500, shouldFail: boolean = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API request failed'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Auth Services
export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  try {
    // Artificial validation
    if (email !== 'demo@example.com' || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return await mockApiRequest({ 
      user: mockUser, 
      token: 'mock-jwt-token-12345'
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (username: string, email: string, password: string): Promise<{ user: User, token: string }> => {
  try {
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }
    
    return await mockApiRequest({ 
      user: { ...mockUser, username, email }, 
      token: 'mock-jwt-token-new-user'
    }, 1500);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  await mockApiRequest(null, 300);
};

// Health Data Services
export const getHealthMetrics = async (type: string, period: 'day' | 'week' | 'month' = 'day'): Promise<HealthMetric[]> => {
  try {
    const metrics = mockHealthData[type] || [];
    return await mockApiRequest(metrics, 800);
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    toast({
      title: "Data Fetch Error",
      description: `Could not load ${type} data. Please try again.`,
      variant: "destructive"
    });
    throw error;
  }
};

export const getAllHealthData = async (): Promise<Record<string, HealthMetric[]>> => {
  try {
    return await mockApiRequest(mockHealthData, 1200);
  } catch (error) {
    console.error('Error fetching all health data:', error);
    toast({
      title: "Data Fetch Error",
      description: "Could not load health data. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Device Services
export const getConnectedDevices = async (): Promise<Device[]> => {
  try {
    return await mockApiRequest(mockDevices, 600);
  } catch (error) {
    console.error('Error fetching devices:', error);
    toast({
      title: "Device Error",
      description: "Could not load connected devices. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const connectToDevice = async (deviceId: string): Promise<Device> => {
  try {
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    
    const updatedDevice = { ...device, connected: true, lastSync: new Date().toISOString() };
    return await mockApiRequest(updatedDevice, 2000);
  } catch (error) {
    console.error('Error connecting to device:', error);
    toast({
      title: "Connection Error",
      description: "Failed to connect to device. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const disconnectDevice = async (deviceId: string): Promise<void> => {
  try {
    await mockApiRequest(null, 500);
  } catch (error) {
    console.error('Error disconnecting device:', error);
    toast({
      title: "Disconnection Error",
      description: "Failed to disconnect device. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// User Services
export const getUserProfile = async (): Promise<User> => {
  try {
    return await mockApiRequest(mockUser, 700);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast({
      title: "Profile Error",
      description: "Could not load user profile. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const updatedUser = { ...mockUser, ...userData };
    return await mockApiRequest(updatedUser, 1000);
  } catch (error) {
    console.error('Error updating profile:', error);
    toast({
      title: "Update Error",
      description: "Failed to update profile. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Export mock data for direct component use
export const getMockHealthData = () => mockHealthData;
export const getMockDevices = () => mockDevices;
