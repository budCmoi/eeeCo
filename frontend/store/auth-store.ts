import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { clearPersistedSession, persistSession } from '@/lib/session';
import type { UserProfile } from '@/types';

type AuthStoreState = {
  token: string | null;
  user: UserProfile | null;
  setSession: (token: string, user: UserProfile) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => {
        persistSession(token, user);
        set({ token, user });
      },
      clearSession: () => {
        clearPersistedSession();
        set({ token: null, user: null });
      }
    }),
    {
      name: 'eeeco-auth'
    }
  )
);