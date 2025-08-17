import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTodaysBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { FlatList, Image, StyleSheet } from "react-native";

export default function TodayScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const todays = getTodaysBirthdays(contacts);

  if (todays.length === 0) {
    return <ThemedText style={styles.empty}>No birthdays today 🎉</ThemedText>;
  }

  return (
    <FlatList
      data={todays}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThemedView style={styles.card}>
          {item.photo && <Image source={{ uri: item.photo }} style={styles.avatar} />}
          <ThemedView>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.birthday}>🎂 {item.birthday}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  birthday: { fontSize: 14, color: "gray" },
  empty: { textAlign: "center", marginTop: 30, fontSize: 16, color: "gray" },
});
