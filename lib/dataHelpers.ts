import * as Contacts from 'expo-contacts';
import { useAppStore } from './store';
// import * as Linking from 'expo-linking';

/**
 * Check if a contact has birthday today
 */
export const isTodayBirthday = (contact: Contacts.Contact): boolean => {
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
};

/**
 * Get upcoming birthdays sorted by next date
 */
export const getUpcomingBirthdays = (contacts: Contacts.Contact[]): BirthdayWithNext[] => {
  const today = new Date();

  return contacts
    .filter((c) => c.birthday)
    .map((c) => {
      const { month, day } = c.birthday;
      let next = new Date(today.getFullYear(), month, day);

      // If this year's birthday already passed, set to next year
      if (next < today) {
        next.setFullYear(today.getFullYear() + 1);
      }

      return { ...c, nextBirthday: next };
    })
    .sort(
      (a, b) =>
        (a.nextBirthday?.getTime() || 0) - (b.nextBirthday?.getTime() || 0)
    );
};

export async function readContacts() {
  try {
    const { status, canAskAgain, granted } = await Contacts.requestPermissionsAsync();
    const permission = await Contacts.getPermissionsAsync();
    console.log("Contacts permission:", permission);
    console.log("Contacts permission status:", status);
    if (granted) {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.Birthday, Contacts.Fields.Image],
      });
      const now = new Date();
      const formatted = now.toLocaleString();
      const store = useAppStore.getState();
      store.setContacts(data);
      store.setLastSynced(formatted);
      return data;
    }
    // else if (canAskAgain) {
    //   Linking.openSettings()
    // }
  } catch (error) {
    console.error("Error reading contacts:", error);
  }
  return [];
}