import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { readContacts } from "@/lib/dataHelpers";
import { sendBirthdayNotification } from "@/lib/notificationHelper";
import { useAppStore } from "@/lib/store";
import { Pressable, StyleSheet, ToastAndroid } from "react-native";

export default function SettingsScreen() {
  const setContacts = useAppStore((s) => s.setContacts);
  const lastSynced = useAppStore((s) => s.lastSynced);

  const settingsData: {
    title: string;
    data: string[];
  }[] = [
      {
        title: 'About',
        data: ['aboutMe', 'spaceAPI', 'theme'],
      },
      {
        title: 'Feedback and Help',
        data: ['help', 'review'],
      },
    ];


  const refreshContacts = async () => {
    try {
      const contacts = await readContacts();
      if (contacts.length > 0) {
        ToastAndroid.show('Contacts refreshed!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      ToastAndroid.show('Error refreshing contacts!', ToastAndroid.SHORT);
    }
  };

  const sendNotification = async() => {
    try{
      await sendBirthdayNotification(["Alice", "Bob"]);
      ToastAndroid.show('Notification sent!', ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error sending notification:", error);
      ToastAndroid.show('Error sending notification!', ToastAndroid.SHORT);
    }
  };

  return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Debug Tools</ThemedText>
        <Pressable style={styles.card} onPress={refreshContacts}>
          <ThemedIcon name="refresh" size={24} />
          <ThemedView>
            <ThemedText>Refresh contacts</ThemedText>
            {lastSynced && (
              <ThemedText style={styles.lastSynced}>Last synced: {lastSynced}</ThemedText>
            )}
          </ThemedView>
        </Pressable>
        <Pressable style={styles.card} onPress={sendNotification}>
          <ThemedIcon name="chatbox-outline" size={24} />
          <ThemedView>
            <ThemedText>Test Notification</ThemedText>
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
