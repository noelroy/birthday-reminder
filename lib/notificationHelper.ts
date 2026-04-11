import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const BIRTHDAY_NOTIFICATION_TYPE = "birthday-reminder";
const DEFAULT_ROLLING_DAYS = 30;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

export async function setupNotifications() {
    let channelConfigured = false;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("birthdays", {
            name: "Birthdays",
            importance: Notifications.AndroidImportance.HIGH,
            sound: null,
        });
        channelConfigured = true;
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
            console.warn('Notifications permission not granted');
            return {
                granted: false,
                status: finalStatus,
                channelConfigured,
                isPhysicalDevice: true,
            };
        }

        return {
            granted: true,
            status: finalStatus,
            channelConfigured,
            isPhysicalDevice: true,
        };

    } else {
        console.warn('Must use physical device for Notifications testing');
        return {
            granted: false,
            status: 'denied' as Notifications.PermissionStatus,
            channelConfigured,
            isPhysicalDevice: false,
        };
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
                        data: { type: BIRTHDAY_NOTIFICATION_TYPE },
        },
        trigger: null, // send immediately
    });
}

type BirthdayContact = {
    name?: string;
    birthday?: {
        day: number;
        month: number;
    };
};

const dayMs = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const dayKey = (date: Date) => startOfDay(date).toISOString().slice(0, 10);

const buildBirthdayMessage = (names: string[]) =>
    names.length === 1
        ? `${names[0]} has a birthday today 🎉`
        : `Birthdays today: ${names.join(", ")} 🎂`;

const nextBirthdayDate = (birthday: { day: number; month: number }, from: Date) => {
    const candidate = new Date(from.getFullYear(), birthday.month, birthday.day);
    if (candidate < from) {
        candidate.setFullYear(from.getFullYear() + 1);
    }
    return candidate;
};

export async function clearScheduledBirthdayNotifications() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const birthdayNotificationIds = scheduled
        .filter((n) => {
            const data = n.content.data as Record<string, unknown> | undefined;
            return data?.type === BIRTHDAY_NOTIFICATION_TYPE;
        })
        .map((n) => n.identifier);

    await Promise.all(
        birthdayNotificationIds.map((identifier) =>
            Notifications.cancelScheduledNotificationAsync(identifier)
        )
    );

    return birthdayNotificationIds.length;
}

export async function scheduleRollingBirthdayNotifications(
    contacts: BirthdayContact[],
    daysAhead: number = DEFAULT_ROLLING_DAYS
) {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        console.log("Notifications not granted; skipping rolling schedule");
        return 0;
    }

    const today = startOfDay(new Date());
    const windowEnd = new Date(today.getTime() + daysAhead * dayMs);
    const grouped = new Map<string, { date: Date; names: string[] }>();

    for (const contact of contacts) {
        if (!contact.birthday) continue;

        const date = nextBirthdayDate(contact.birthday, today);
        if (date > windowEnd) continue;

        const key = dayKey(date);
        const existing = grouped.get(key);

        if (existing) {
            if (contact.name) existing.names.push(contact.name);
            continue;
        }

        grouped.set(key, {
            date,
            names: contact.name ? [contact.name] : ["Someone"],
        });
    }

    await clearScheduledBirthdayNotifications();

    const now = new Date();
    let scheduledCount = 0;

    for (const { date, names } of grouped.values()) {
        const triggerDate = new Date(date);
        triggerDate.setHours(9, 0, 0, 0);

        if (triggerDate <= now) {
            triggerDate.setTime(now.getTime() + 60 * 1000);
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🎂 Birthday Reminder",
                body: buildBirthdayMessage(names),
                sound: true,
                data: {
                    type: BIRTHDAY_NOTIFICATION_TYPE,
                    key: dayKey(date),
                    count: names.length,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });

        scheduledCount += 1;
    }

    return scheduledCount;
}

export type NotificationScheduleStatus = {
    permissionStatus: Notifications.PermissionStatus;
    birthdayScheduledCount: number;
    totalScheduledCount: number;
};

export async function getNotificationScheduleStatus(): Promise<NotificationScheduleStatus> {
    const permission = await Notifications.getPermissionsAsync();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const birthdayScheduledCount = scheduled.filter((n) => {
        const data = n.content.data as Record<string, unknown> | undefined;
        return data?.type === BIRTHDAY_NOTIFICATION_TYPE;
    }).length;

    return {
        permissionStatus: permission.status,
        birthdayScheduledCount,
        totalScheduledCount: scheduled.length,
    };
}
