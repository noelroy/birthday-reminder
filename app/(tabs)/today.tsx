import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTodaysBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TodayScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const todays = getTodaysBirthdays(contacts);
  const insets = useSafeAreaInsets();


  if (todays.length === 0) {
    return <ThemedView style={styles.emptyContainer}><ThemedText style={styles.empty}>No birthdays today 🎉</ThemedText></ThemedView>;
  }

  return (
    <SafeAreaView>
    <FlatList
      data={todays}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <ThemedView style={styles.card}>
          {item.image && <Image source={{ uri: item.image.uri }} style={styles.avatar} />}
          <ThemedView>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.birthday}>🎂 {item.birthday?.label}</ThemedText>
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
