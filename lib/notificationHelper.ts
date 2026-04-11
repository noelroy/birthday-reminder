import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const BIRTHDAY_NOTIFICATION_TYPE = "birthday-reminder";
const BIRTHDAY_NOTIFICATION_CHANNEL_ID = "birthdays";
const DEFAULT_ROLLING_DAYS = 30;

Notifications.setNotificationHandler({
        handleNotification: async () => ({
                shouldPlaySound: false,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
        }),
});

export type SetupNotificationsResult = {
        granted: boolean;
        status: Notifications.PermissionStatus;
        channelConfigured: boolean;
        isPhysicalDevice: boolean;
};

export async function setupNotifications(): Promise<SetupNotificationsResult> {
    let channelConfigured = false;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(BIRTHDAY_NOTIFICATION_CHANNEL_ID, {
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

export async function testBirthdayNotification(names: string[]) {
    if (names.length === 0) return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        console.warn("Cannot send test notification: notification permission is not granted");
        return;
    }

    const message = buildBirthdayMessage(names);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🎂 Birthday Reminder",
            body: message,
            sound: false,
            ...(Platform.OS === "android" ? { channelId: BIRTHDAY_NOTIFICATION_CHANNEL_ID } : {}),
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

const dayKey = (date: Date) => {
    const local = startOfDay(date);
    const y = local.getFullYear();
    const m = String(local.getMonth() + 1).padStart(2, "0");
    const d = String(local.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

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
                ...(Platform.OS === "android" ? { channelId: BIRTHDAY_NOTIFICATION_CHANNEL_ID } : {}),
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
