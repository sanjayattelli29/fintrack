import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  phone: string;
  image: string;
  currency: string;
  defaultCommission: number;
  defaultTax: number;
}

interface Account {
  id: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  profile: UserProfile;
  accounts: Account[];
  currentAccountId: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAccount: (name: string) => void;
  updateAccount: (id: string, name: string) => void;
  deleteAccount: (id: string) => void;
  setCurrentAccount: (id: string) => void;
  getCurrentAccount: () => Account | null;
  updateDefaultRates: (commission: number, tax: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: null,
      profile: {
        name: 'Sanjay Kumar',
        phone: '+91 8977300290',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        currency: 'USD',
        defaultCommission: 0,
        defaultTax: 0,
      },
      accounts: [],
      currentAccountId: null,
      login: (username: string, password: string) => {
        if (username === 'editwithsanjay' && password === '29@Sanjay') {
          set({ isAuthenticated: true, username });
          const state = get();
          if (state.accounts.length === 0) {
            const defaultAccount: Account = {
              id: 'default',
              name: 'Personal Account',
              createdAt: new Date().toISOString(),
            };
            set({ 
              accounts: [defaultAccount],
              currentAccountId: defaultAccount.id
            });
          }
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
      updateProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),
      addAccount: (name: string) => {
        const newAccount: Account = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
          currentAccountId: state.currentAccountId || newAccount.id,
        }));
      },
      updateAccount: (id: string, name: string) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, name } : account
          ),
        })),
      deleteAccount: (id: string) =>
        set((state) => {
          if (state.accounts.length <= 1) {
            return state;
          }
          const newAccounts = state.accounts.filter((account) => account.id !== id);
          return {
            accounts: newAccounts,
            currentAccountId:
              state.currentAccountId === id ? newAccounts[0].id : state.currentAccountId,
          };
        }),
      setCurrentAccount: (id: string) =>
        set({ currentAccountId: id }),
      getCurrentAccount: () => {
        const state = get();
        return state.accounts.find((account) => account.id === state.currentAccountId) || null;
      },
      updateDefaultRates: (commission: number, tax: number) =>
        set((state) => ({
          profile: {
            ...state.profile,
            defaultCommission: commission,
            defaultTax: tax,
          },
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);