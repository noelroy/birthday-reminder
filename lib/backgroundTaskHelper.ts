import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { getContacts } from "./dataHelpers";
import { scheduleRollingBirthdayNotifications } from "./notificationHelper";

export const TASK_NAME = "NOTIFY_BIRTHDAY_DAILY";

export const TASK_INTERVAL = 6 * 60; // 6 hours

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("Running background task to refresh birthday schedule...");
    const data = await getContacts();
    const scheduled = await scheduleRollingBirthdayNotifications(data, 30);
    console.log(`Refreshed rolling birthday schedule: ${scheduled} day(s) queued`);
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Error occurred while notifying birthdays:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const registerBackgroundTaskAsync = async () => {
  try {
    const isTaskDefined = TaskManager.isTaskDefined(TASK_NAME);
    console.log("Is task defined:", isTaskDefined ? "Yes" : "No");
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(TASK_NAME, {
        minimumInterval: TASK_INTERVAL,
      });
    }
    console.log("📌 Background task registered");
  } catch (error) {
    console.error("Failed to register background task:", error);
  }
};

export async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(TASK_NAME);
}