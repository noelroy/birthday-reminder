import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TASK_NAME as BACKGROUND_TASK_IDENTIFIER } from "@/lib/backgroundTaskHelper";
import { getContacts } from "@/lib/dataHelpers";
import { sendBirthdayNotification } from "@/lib/notificationHelper";
import { useAppStore } from "@/lib/store";
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, ToastAndroid } from "react-native";

export default function SettingsScreen() {
  const lastSynced = useAppStore((s) => s.lastSynced);

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

  return (
      <ThemedView style={styles.container}>
        <Pressable style={styles.card} onPress={refreshContacts}>
          <ThemedIcon name="refresh" size={24} />
          <ThemedView>
            <ThemedText>Refresh contacts</ThemedText>
            {lastSynced && (
              <ThemedText style={styles.lastSynced}>Last synced: {lastSynced}</ThemedText>
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
            <ThemedText style={styles.lastSynced}>{status === BackgroundTask.BackgroundTaskStatus.Restricted ? 'Unavailable' : 'Available'}: {isRegistered ? 'Registered' : 'Not registered'}</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10, gap: 10 },
  lastSynced: { fontSize: 12, color: "gray" },
});
