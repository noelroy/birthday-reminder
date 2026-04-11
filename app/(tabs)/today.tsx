import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TodayBirthdayCard from "@/components/today/TodayBirthdayCard";
import { getTodaysBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { FlatList, StyleSheet } from "react-native";

export default function TodayScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const todays = getTodaysBirthdays(contacts);

  if (todays.length === 0) {
    return <ThemedView style={styles.emptyContainer}><ThemedText style={styles.empty}>No birthdays today 🎉</ThemedText></ThemedView>;
  }

  return (
    <FlatList
      data={todays}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <TodayBirthdayCard item={item} />}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 10 },
  empty: { textAlign: "center", fontSize: 16, marginTop: 30 },
});
