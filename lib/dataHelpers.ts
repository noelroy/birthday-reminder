import { Contact } from "@/types/people_types";

/**
 * Check if a contact has birthday today
 */
export const isTodayBirthday = (contact: Contact): boolean => {
  if (!contact.birthday || contact.birthday === "N/A") return false;

  const [month, day] = contact.birthday.split("/").map(Number);
  const today = new Date();

  return today.getMonth() + 1 === month && today.getDate() === day;
};

/**
 * Get today's birthdays
 */
export const getTodaysBirthdays = (contacts: Contact[]): Contact[] => {
  return contacts.filter(isTodayBirthday);
};

/**
 * Get upcoming birthdays sorted by next date
 */
export const getUpcomingBirthdays = (contacts: Contact[]): Contact[] => {
  const today = new Date();

  return contacts
    .filter((c) => c.birthday !== "N/A")
    .map((c) => {
      const [month, day] = c.birthday.split("/").map(Number);
      let next = new Date(today.getFullYear(), month - 1, day);

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
