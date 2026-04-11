import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { registerBackgroundTaskAsync } from "@/lib/backgroundTaskHelper";
import { readContacts } from "@/lib/dataHelpers";
import { scheduleRollingBirthdayNotifications, setupNotifications } from "@/lib/notificationHelper";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function SignInScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const contacts = await readContacts();
        await setupNotifications();
        const scheduledCount = await scheduleRollingBirthdayNotifications(contacts, 30);
        console.log(`Scheduled ${scheduledCount} birthday reminder day(s) for next 30 days`);
        await registerBackgroundTaskAsync();
        if (__DEV__) console.log('Running in dev mode');
        console.log("Initialization complete, navigating to main screen");
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    loading ? <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView> :
      <Redirect href="/today" />

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
