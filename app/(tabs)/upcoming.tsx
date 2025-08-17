import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getUpcomingBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function UpcomingScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const upcoming = getUpcomingBirthdays(contacts);

  if (upcoming.length === 0) {
    return <ThemedView style={styles.emptyContainer}><ThemedText style={styles.empty}>No upcoming birthdays 🎉</ThemedText></ThemedView>;
  }

  return (
    <SafeAreaView>
    <FlatList
      data={upcoming}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <ThemedView style={styles.card}>
          {item.image && <Image source={{ uri: item.image.uri }} style={styles.avatar} />}
          <ThemedView>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.birthday}>🎂 {item.nextBirthday?.toLocaleDateString()}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  birthday: { fontSize: 14, color: "gray" },
  empty: { textAlign: "center", marginTop: 30, fontSize: 16, color: "gray" },
});
