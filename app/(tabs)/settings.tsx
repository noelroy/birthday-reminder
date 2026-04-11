import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppColors } from "@/hooks/useAppColors";
import { TASK_NAME as BACKGROUND_TASK_IDENTIFIER } from "@/lib/backgroundTaskHelper";
import { getContacts } from "@/lib/dataHelpers";
import { sendBirthdayNotification } from "@/lib/notificationHelper";
import { ThemePreference, useAppStore } from "@/lib/store";
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from "expo-task-manager";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, ToastAndroid } from "react-native";

export default function SettingsScreen() {
  const colors = useAppColors();
  const lastSynced = useAppStore((s) => s.lastSynced);
  const themePreference = useAppStore((s) => s.themePreference);
  const setThemePreference = useAppStore((s) => s.setThemePreference);
  const dynamicStyles = useMemo(() => createDynamicStyles(colors), [colors]);

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  useEffect(() => {
    updateAsync();
  }, []);

  const updateAsync = async () => {
    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
    setIsRegistered(isRegistered);
  };

  const refreshContacts = async () => {
    try {
      const contacts = await getContacts();
      if (contacts.length > 0) {
        ToastAndroid.show('Contacts refreshed!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      ToastAndroid.show('Error refreshing contacts!', ToastAndroid.SHORT);
    }
  };

  const testNotification = async() => {
    try{
      await sendBirthdayNotification(["Alice", "Bob"]);
      ToastAndroid.show('Notification sent!', ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error sending notification:", error);
      ToastAndroid.show('Error sending notification!', ToastAndroid.SHORT);
    }
  };

  const testBackgroundTask = async () => {
    const result = await BackgroundTask.triggerTaskWorkerForTestingAsync();
    console.log("Background task triggered:", result);
    ToastAndroid.show('Background task triggered!', ToastAndroid.SHORT);
  };

  const themeOptions: Array<{ label: string; value: ThemePreference }> = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.themeSection}>
          <ThemedText type="defaultSemiBold">Color Scheme</ThemedText>
          <ThemedView style={styles.themeRow}>
            {themeOptions.map((option) => {
              const isActive = themePreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.themeChip, dynamicStyles.themeChip, isActive && dynamicStyles.themeChipActive]}
                  onPress={() => setThemePreference(option.value)}
                >
                  <ThemedText style={[styles.themeChipText, isActive && dynamicStyles.themeChipTextActive]}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>
        </ThemedView>

        <Pressable style={styles.card} onPress={refreshContacts}>
          <ThemedIcon name="refresh" size={24} />
          <ThemedView>
            <ThemedText>Refresh contacts</ThemedText>
            {lastSynced && (
              <ThemedText style={[styles.lastSynced, dynamicStyles.lastSynced]}>
                Last synced: {lastSynced}
              </ThemedText>
            )}
          </ThemedView>
        </Pressable>
        <Pressable style={styles.card} onPress={testNotification}>
          <ThemedIcon name="chatbox-outline" size={24} />
          <ThemedView>
            <ThemedText>Test Notification</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable style={styles.card} onPress={testBackgroundTask}>
          <ThemedIcon name="chatbox-outline" size={24} />
          <ThemedView>
            <ThemedText>Test Background Task</ThemedText>
            <ThemedText type="muted" style={styles.lastSynced}>
              {status === BackgroundTask.BackgroundTaskStatus.Restricted ? 'Unavailable' : 'Available'}: {isRegistered ? 'Registered' : 'Not registered'}
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  themeSection: { marginVertical: 10, padding: 10, gap: 10 },
  themeRow: { flexDirection: 'row', gap: 8 },
  themeChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  themeChipText: { fontSize: 13 },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10, gap: 10 },
  lastSynced: { fontSize: 12 },
});

type AppColors = ReturnType<typeof useAppColors>;

const createDynamicStyles = (colors: AppColors) =>
  StyleSheet.create({
    themeChip: {
      borderColor: colors.border,
    },
    themeChipActive: {
      borderColor: colors.tint,
      backgroundColor: colors.tint,
    },
    themeChipTextActive: {
      color: colors.background,
    },
  });
