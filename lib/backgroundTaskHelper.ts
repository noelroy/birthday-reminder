import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { getTodaysBirthdays, readContacts } from "./dataHelpers";
import { sendBirthdayNotification } from "./notificationHelper";

const TASK_NAME = "NOTIFY_BIRTHDAY_DAILY";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const contacts = await readContacts();
    const todays = getTodaysBirthdays(contacts);
    if (todays.length <= 0) {
      console.log("No birthdays today, skipping notification");
      return BackgroundTask.BackgroundTaskResult.Success;
    }
    const names = todays.map((contact) => contact.name);
    await sendBirthdayNotification(names);
    console.log("Notified birthdays for:", names.join(", "));
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Error occurred while notifying birthdays:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const registerBackgroundTask = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60 * 60 * 24, // 24 hours
      });
    }
    console.log("📌 Background task registered");
  } catch (error) {
    console.error("Failed to register background task:", error);
  }
};
