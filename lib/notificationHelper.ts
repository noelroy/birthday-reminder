import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

export async function setupNotifications() {

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("birthdays", {
            name: "Birthdays",
            importance: Notifications.AndroidImportance.HIGH,
            sound: null,
        });
        console.log("Notification channel set up for Android");
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        console.log("Existing notification status:", existingStatus);
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

    } else {
        alert('Must use physical device for Push Notifications');
    }
}

export async function sendBirthdayNotification(names: string[]) {
    if (names.length === 0) return;

    const message =
        names.length === 1
            ? `${names[0]} has a birthday today 🎉`
            : `Birthdays today: ${names.join(", ")} 🎂`;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🎂 Birthday Reminder",
            body: message,
            sound: true,
        },
        trigger: null, // send immediately
    });
}
