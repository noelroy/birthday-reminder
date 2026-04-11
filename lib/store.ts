import * as Contacts from 'expo-contacts';
import { create } from "zustand";

export type ThemePreference = 'system' | 'light' | 'dark';

interface AppState {
  contacts: Contacts.Contact[];
  setContacts: (contacts: Contacts.Contact[]) => void;
  lastSynced: string | null;
  setLastSynced: (time: string) => void;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
}

export const useAppStore = create<AppState>((set) => ({
  contacts: [],
  lastSynced: null,
  themePreference: 'system',
  setLastSynced: (time) => set({ lastSynced: time }),
  setContacts: (contacts) => set({ contacts }),
  setThemePreference: (theme) => set({ themePreference: theme }),
}));
