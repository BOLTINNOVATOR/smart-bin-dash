import { create } from 'zustand';

export type UserRole = 'citizen' | 'collector' | 'admin' | 'super-admin' | 'guest';

export type WasteType = 'wet' | 'dry' | 'hazardous';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string;
  society?: string;
  points?: number;
}

export interface Bin {
  id: string;
  type: WasteType;
  location: { lat: number; lng: number };
  address: string;
  fillLevel: number;
  lastCollection: string;
  status: 'ok' | 'warning' | 'full' | 'offline';
  batteryLevel: number;
}

export interface Classification {
  id: string;
  image: string;
  predictedClass: WasteType;
  confidence: number;
  timestamp: string;
  verified?: boolean;
}

interface AppState {
  user: User | null;
  currentPage: string;
  language: 'en' | 'hi';
  bins: Bin[];
  classifications: Classification[];
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
  toggleLanguage: () => void;
  addClassification: (classification: Classification) => void;
  updateBin: (binId: string, updates: Partial<Bin>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  currentPage: '/',
  language: 'en',
  bins: [
    {
      id: 'bin-001',
      type: 'wet',
      location: { lat: 28.7041, lng: 77.1025 },
      address: 'Block A, Sector 12, Delhi',
      fillLevel: 65,
      lastCollection: '2024-01-15T10:30:00Z',
      status: 'warning',
      batteryLevel: 85,
    },
    {
      id: 'bin-002',
      type: 'dry',
      location: { lat: 28.7045, lng: 77.1028 },
      address: 'Block B, Sector 12, Delhi',
      fillLevel: 30,
      lastCollection: '2024-01-14T14:20:00Z',
      status: 'ok',
      batteryLevel: 92,
    },
    {
      id: 'bin-003',
      type: 'hazardous',
      location: { lat: 28.7038, lng: 77.1022 },
      address: 'Block C, Sector 12, Delhi',
      fillLevel: 90,
      lastCollection: '2024-01-10T09:15:00Z',
      status: 'full',
      batteryLevel: 45,
    },
  ],
  classifications: [],
  
  setUser: (user) => set({ user }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleLanguage: () => set((state) => ({ 
    language: state.language === 'en' ? 'hi' : 'en' 
  })),
  addClassification: (classification) => set((state) => ({
    classifications: [classification, ...state.classifications]
  })),
  updateBin: (binId, updates) => set((state) => ({
    bins: state.bins.map(bin => 
      bin.id === binId ? { ...bin, ...updates } : bin
    )
  })),
}));