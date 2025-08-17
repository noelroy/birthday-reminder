import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { readContacts } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const setContacts = useAppStore((s) => s.setContacts);

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
      const contacts = await readContacts()
      setContacts(contacts);
    } catch (error) {
      console.error("Error refreshing contacts:", error);
    }
  };

  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Debug Tools</ThemedText>
        <Pressable style={styles.card} onPress={refreshContacts}>
          <ThemedIcon name="refresh" size={24} />
          <ThemedText>Refresh contacts</ThemedText>
        </Pressable>
      </ThemedView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10, gap: 10 },
});
