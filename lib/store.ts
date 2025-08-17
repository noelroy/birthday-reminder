import { Contact } from "@/types/people_types";
import { User } from "@react-native-google-signin/google-signin";
import { create } from "zustand";

interface AppState {
  user: User | null;
  contacts: Contact[];
  setUser: (user: User | null) => void;
  setContacts: (contacts: Contact[]) => void;
  signOut: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  contacts: [],
  setUser: (user) => set({ user }),
  setContacts: (contacts) => set({ contacts }),
  signOut: () => set({ user: null, contacts: [] }),
}));
