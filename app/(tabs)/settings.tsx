import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {

  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Debug tools ⚙️</ThemedText>
      <ThemedText style={styles.subtitle}>This is a debug screen for testing purposes.</ThemedText>

      {/* <Pressable style={styles.signOutBtn} onPress={signOut}>
        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
      </Pressable> */}
    </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 16, color: "white", marginBottom: 30 }
});
