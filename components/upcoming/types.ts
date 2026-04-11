import { getUpcomingBirthdays } from "@/lib/dataHelpers";

export type UpcomingItem = ReturnType<typeof getUpcomingBirthdays>[number];
