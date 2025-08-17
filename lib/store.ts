import * as Contacts from 'expo-contacts';
import { create } from "zustand";

interface AppState {
  contacts: Contacts.Contact[];
  setContacts: (contacts: Contacts.Contact[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
}));
