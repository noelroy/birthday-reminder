import * as Contacts from 'expo-contacts';
import { create } from "zustand";

interface AppState {
  contacts: Contacts.Contact[];
  setContacts: (contacts: Contacts.Contact[]) => void;
  lastSynced: string | null;
  setLastSynced: (time: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  contacts: [],
  lastSynced: null,
  setLastSynced: (time) => set({ lastSynced: time }),
  setContacts: (contacts) => set({ contacts }),
}));
