
import { atom } from 'jotai';
import { Device, HealthMetric } from './api';

// Health data atoms
export const healthDataAtom = atom<Record<string, HealthMetric[]>>({});
export const loadingHealthDataAtom = atom<boolean>(false);

// Devices atoms
export const devicesAtom = atom<Device[]>([]);
export const selectedDeviceAtom = atom<Device | null>(null);
export const connectingDeviceAtom = atom<boolean>(false);

// UI state atoms
export const activePeriodAtom = atom<'day' | 'week' | 'month'>('day');
export const activeTabAtom = atom<string>('dashboard');
