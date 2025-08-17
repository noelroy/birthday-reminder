import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signOutFromGoogle } from "@/lib/authHelpers";
import { useAppStore } from "@/lib/store";
import { Pressable, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const user = useAppStore((s) => s.user);
  const resetStore = useAppStore((s) => s.signOut);

  const signOut = async () => {
    try {
      await signOutFromGoogle();
      resetStore();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Settings ⚙️</ThemedText>

      {user && (
        <ThemedText style={styles.subtitle}>
          Signed in as: {user.user?.name ?? "Unknown"}
        </ThemedText>
      )}

      <Pressable style={styles.signOutBtn} onPress={signOut}>
        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 30 },
  signOutBtn: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutText: { color: "white", fontWeight: "600", fontSize: 16 },
});
