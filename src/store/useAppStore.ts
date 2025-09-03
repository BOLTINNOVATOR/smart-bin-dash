import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import seedData from '../data/seed.json';

export type UserRole = 'citizen' | 'collector' | 'admin' | 'super-admin' | 'guest';
export type WasteType = 'wet' | 'dry' | 'hazardous';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintType = 'missed_pickup' | 'bin_overflow' | 'waste_mixing' | 'bin_damage' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string;
  society?: string;
  points?: number;
}

export interface Household {
  id: string;
  name: string;
  address: string;
  ward: string;
  society: string;
  contactPhone: string;
  binId: string;
  segregationScore: number;
  monthlyWaste: {
    wet: number;
    dry: number;
    hazardous: number;
  };
  rewardPoints: number;
  badges: string[];
  joinedDate: string;
}

export interface Collector {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  ward: string;
  activeRoute: string;
  status: 'active' | 'break' | 'offline';
  todayPickups: number;
  totalPickups: number;
}

export interface Route {
  id: string;
  name: string;
  collectorId: string;
  binIds: string[];
  estimatedTime: string;
  distance: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  days: string[];
  wasteTypes: WasteType[];
}

export interface Complaint {
  id: string;
  householdId: string;
  type: ComplaintType;
  priority: 'low' | 'medium' | 'high';
  status: ComplaintStatus;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  imageUrl?: string;
  submittedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  resolution?: string;
}

export interface PickupLog {
  id: string;
  binId: string;
  collectorId: string;
  routeId: string;
  wasteType: WasteType;
  weight: number;
  segregationScore: number;
  contaminationLevel: number;
  timestamp: string;
  beforeImage?: string;
  afterImage?: string;
  location: {
    lat: number;
    lng: number;
  };
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

export interface SensorReading {
  timestamp: string;
  fillLevel: number;
  weight: number;
  temperature: number;
  humidity: number;
  gasLevels: {
    methane: number;
    ammonia: number;
    hydrogen_sulfide: number;
  };
  batteryLevel: number;
}

export interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  category: string;
  description: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
  imageUrl: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirements: Record<string, any>;
}

export interface GreenTip {
  id: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

interface AppState {
  // Core state
  user: User | null;
  currentPage: string;
  language: 'en' | 'hi';
  
  // Data collections
  bins: Bin[];
  classifications: Classification[];
  households: Household[];
  collectors: Collector[];
  routes: Route[];
  complaints: Complaint[];
  pickupLogs: PickupLog[];
  rewards: Reward[];
  achievements: Achievement[];
  greenTips: GreenTip[];
  stories: Story[];
  sensorData: Record<string, SensorReading[]>;
  
  // UI state
  isOffline: boolean;
  lastSyncTime: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
  toggleLanguage: () => void;
  addClassification: (classification: Classification) => void;
  updateBin: (binId: string, updates: Partial<Bin>) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  addPickupLog: (log: PickupLog) => void;
  updateSensorData: (binId: string, readings: SensorReading[]) => void;
  initializeData: () => void;
  setOfflineStatus: (offline: boolean) => void;
  syncData: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      currentPage: '/',
      language: 'en',
      bins: [],
      classifications: [],
      households: [],
      collectors: [],
      routes: [],
      complaints: [],
      pickupLogs: [],
      rewards: [],
      achievements: [],
      greenTips: [],
      stories: [],
      sensorData: {},
      isOffline: false,
      lastSyncTime: null,
      
      // Actions
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
      
      addComplaint: (complaint) => set((state) => ({
        complaints: [complaint, ...state.complaints]
      })),
      
      updateComplaint: (complaintId, updates) => set((state) => ({
        complaints: state.complaints.map(complaint =>
          complaint.id === complaintId ? { ...complaint, ...updates } : complaint
        )
      })),
      
      addPickupLog: (log) => set((state) => ({
        pickupLogs: [log, ...state.pickupLogs]
      })),
      
      updateSensorData: (binId, readings) => set((state) => ({
        sensorData: {
          ...state.sensorData,
          [binId]: readings
        }
      })),
      
      initializeData: () => {
        const typedSeedData = seedData as any;
        set({
          bins: [
            {
              id: 'bin-001',
              type: 'wet' as WasteType,
              location: { lat: 28.7041, lng: 77.1025 },
              address: 'Block A, Green Valley Society, Sector 12, Delhi',
              fillLevel: 65,
              lastCollection: '2024-01-15T10:30:00Z',
              status: 'warning' as const,
              batteryLevel: 85,
            },
            {
              id: 'bin-002',
              type: 'dry' as WasteType,
              location: { lat: 28.7045, lng: 77.1028 },
              address: 'Block B, Eco Homes, Sector 15, Delhi',
              fillLevel: 30,
              lastCollection: '2024-01-14T14:20:00Z',
              status: 'ok' as const,
              batteryLevel: 92,
            },
            {
              id: 'bin-003',
              type: 'hazardous' as WasteType,
              location: { lat: 28.7038, lng: 77.1022 },
              address: 'Block C, Smart City Apartments, Sector 18, Delhi',
              fillLevel: 90,
              lastCollection: '2024-01-10T09:15:00Z',
              status: 'full' as const,
              batteryLevel: 45,
            },
            {
              id: 'bin-004',
              type: 'wet' as WasteType,
              location: { lat: 28.7042, lng: 77.1030 },
              address: 'Sustainable Living Complex, Sector 22, Delhi',
              fillLevel: 25,
              lastCollection: '2024-01-16T06:45:00Z',
              status: 'ok' as const,
              batteryLevel: 78,
            },
            {
              id: 'bin-005',
              type: 'dry' as WasteType,
              location: { lat: 28.7048, lng: 77.1035 },
              address: 'Green Tech Society, Sector 25, Delhi',
              fillLevel: 55,
              lastCollection: '2024-01-15T13:20:00Z',
              status: 'warning' as const,
              batteryLevel: 91,
            }
          ],
          households: typedSeedData.households || [],
          collectors: typedSeedData.collectors || [],
          routes: typedSeedData.routes || [],
          complaints: typedSeedData.complaints || [],
          pickupLogs: typedSeedData.pickupLogs || [],
          rewards: typedSeedData.rewardCatalog || [],
          achievements: typedSeedData.achievements || [],
          greenTips: typedSeedData.greenTips || [],
          stories: typedSeedData.stories || [],
          sensorData: typedSeedData.sensorData || {},
          lastSyncTime: new Date().toISOString()
        });
      },
      
      setOfflineStatus: (offline) => set({ isOffline: offline }),
      
      syncData: async () => {
        // Simulate API sync
        return new Promise((resolve) => {
          setTimeout(() => {
            set({ lastSyncTime: new Date().toISOString() });
            resolve();
          }, 1000);
        });
      }
    }),
    {
      name: 'waste-management-store',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        classifications: state.classifications,
        complaints: state.complaints,
        lastSyncTime: state.lastSyncTime
      })
    }
  )
);