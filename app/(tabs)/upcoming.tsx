import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getUpcomingBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { Image, SectionList, StyleSheet } from "react-native";


export default function UpcomingScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const upcoming = getUpcomingBirthdays(contacts);

  const sections = upcoming.reduce<
    Array<{
      title: string;
      data: typeof upcoming;
    }>
  >((acc, item) => {
    const title = item.nextBirthday
      ? item.nextBirthday.toLocaleDateString("default", {
          month: "long",
          year: "numeric",
        })
      : "Unknown";
    const existingSection = acc.find((section) => section.title === title);

    if (existingSection) {
      existingSection.data.push(item);
    } else {
      acc.push({ title, data: [item] });
    }

    return acc;
  }, []);

  if (upcoming.length === 0) {
    return <ThemedView style={styles.emptyContainer}><ThemedText style={styles.empty}>No upcoming birthdays 🎉</ThemedText></ThemedView>;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.name}
      renderSectionHeader={({ section }) => (
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
        </ThemedView>
      )}
      renderItem={({ item }) => {
        const daysLeft = item.daysLeft;

        return (
          <ThemedView style={styles.card}>
            {item.image?.uri ? (<Image source={{ uri: item.image.uri }} style={styles.avatar} />) :
              (<ThemedIcon name="person-circle" size={50} style={styles.avatar} />)}
            <ThemedView>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedView style={styles.metaRow}>
                <ThemedText style={styles.birthday}>🎂 {item.nextBirthday?.toLocaleDateString()}</ThemedText>
                {daysLeft !== null && (
                  <ThemedView style={styles.badge}>
                    <ThemedText style={styles.badgeText}>
                      {daysLeft === 0 ? "Today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionHeader: { paddingHorizontal: 10, paddingTop: 14, paddingBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  birthday: { fontSize: 14, color: "gray" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: "#b4bbc7",
  },
  badgeText: { fontSize: 10, color: "#18488B" },
  empty: { textAlign: "center", marginTop: 30, fontSize: 16, color: "gray" },
});
