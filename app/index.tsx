import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { registerBackgroundTask } from "@/lib/backgroundTaskHelper";
import { readContacts } from "@/lib/dataHelpers";
import { setupNotifications } from "@/lib/notificationHelper";
import * as Notifications from 'expo-notifications';
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function SignInScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await readContacts();
      await setupNotifications()
      await registerBackgroundTask();
      setLoading(false);
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
