import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import { useAppStore } from './store';

const CONTACT_PERMISSION_TIMEOUT_MS = 8000;

async function requestContactsPermissionWithTimeout() {
  return Promise.race([
    Contacts.requestPermissionsAsync(),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timed out while requesting contacts permission'));
      }, CONTACT_PERMISSION_TIMEOUT_MS);
    }),
  ]);
}

/**
 * Check if a contact has birthday today
 */
const isTodayBirthday = (contact: Contacts.Contact): boolean => {
  if (!contact.birthday) return false;

  const { day, month } = contact.birthday;
  const today = new Date();

  return today.getMonth() === month && today.getDate() === day;
};

/**
 * Get today's birthdays
 */
export const getTodaysBirthdays = (contacts: Contacts.Contact[]): Contacts.Contact[] => {
  return contacts.filter(isTodayBirthday);
};

type BirthdayWithNext = Contacts.Contact & {
  nextBirthday?: Date;
  daysLeft?: number;
};

/**
 * Get upcoming birthdays sorted by next date
 */
export const getUpcomingBirthdays = (contacts: Contacts.Contact[]): BirthdayWithNext[] => {
  const today = new Date();
  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;

  return contacts
    .filter((c) => c.birthday)
    .map((c) => {
      const birthday = c.birthday!;
      const { month, day } = birthday;
      let next = new Date(today.getFullYear(), month, day);

      // If this year's birthday already passed, set to next year
      if (next < today) {
        next.setFullYear(today.getFullYear() + 1);
      }

      const normalizedNext = new Date(next);
      normalizedNext.setHours(0, 0, 0, 0);
      const daysLeft = Math.max(
        0,
        Math.ceil((normalizedNext.getTime() - normalizedToday.getTime()) / msPerDay)
      );

      return { ...c, nextBirthday: next, daysLeft };
    })
    .sort(
      (a, b) =>
        (a.nextBirthday?.getTime() || 0) - (b.nextBirthday?.getTime() || 0)
    );
};

export async function readContacts() {
  try {
    const existing = await Contacts.getPermissionsAsync();
    if (existing.granted) return getContacts();

    if (!existing.canAskAgain) {
      await Linking.openSettings();
      return [];
    }

    const { status, canAskAgain, granted } = await requestContactsPermissionWithTimeout();
    console.log("Contacts permission request result:", { status, canAskAgain, granted });
    const permission = await Contacts.getPermissionsAsync();
    console.log("Contacts permission:", permission);
    console.log("Contacts permission status:", status);
    if (granted) {
      return await getContacts();
    }
    if (!canAskAgain) {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error("Error reading contacts:", error);
  }
  return [];
}

export async function getContacts(): Promise<Contacts.Contact[]> {
  try {
    console.log("Fetching contacts...");
    const { data } =  await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.Birthday, Contacts.Fields.Image],
    });
    const now = new Date();
      const formatted = now.toLocaleString();
      const store = useAppStore.getState();
      store.setContacts(data);
      store.setLastSynced(formatted);
      return data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

