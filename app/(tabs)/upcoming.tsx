import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getUpcomingBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, SectionList, StyleSheet, TextInput } from "react-native";

export default function UpcomingScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const upcoming = getUpcomingBirthdays(contacts);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const availableMonths = useMemo(() => {
    const monthMap = new Map<number, string>();

    upcoming.forEach((item) => {
      if (!item.nextBirthday) return;
      const monthIndex = item.nextBirthday.getMonth();
      if (!monthMap.has(monthIndex)) {
        monthMap.set(
          monthIndex,
          item.nextBirthday.toLocaleDateString("default", { month: "long" })
        );
      }
    });

    return Array.from(monthMap.entries()).map(([value, label]) => ({
      value: String(value),
      label,
    }));
  }, [upcoming]);

  const filteredUpcoming = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return upcoming.filter((item) => {
      const matchesName =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch);

      const matchesMonth =
        selectedMonth === "all" ||
        String(item.nextBirthday?.getMonth()) === selectedMonth;

      return matchesName && matchesMonth;
    });
  }, [searchText, selectedMonth, upcoming]);

  const sections = filteredUpcoming.reduce<
    Array<{
      title: string;
      data: typeof filteredUpcoming;
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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.filtersCard}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name"
          placeholderTextColor="#8A8A8A"
          style={styles.searchInput}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthChips}>
          <FilterChip label="All months" active={selectedMonth === "all"} onPress={() => setSelectedMonth("all")} />
          {availableMonths.map((month) => (
            <FilterChip
              key={month.value}
              label={month.label}
              active={selectedMonth === month.value}
              onPress={() => setSelectedMonth(month.value)}
            />
          ))}
        </ScrollView>
      </ThemedView>

      {filteredUpcoming.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.empty}>No birthdays match your filters 🎉</ThemedText>
        </ThemedView>
      ) : (
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
                {item.image?.uri ? (
                  <Image source={{ uri: item.image.uri }} style={styles.avatar} />
                ) : (
                  <ThemedIcon name="person-circle" size={50} style={styles.avatar} />
                )}
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
      )}
    </ThemedView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}
    >
      <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filtersCard: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 4, gap: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D7DCE3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  monthChips: { gap: 8, paddingBottom: 6 },
  chip: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EEF2F7",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "#18488B" },
  chipPressed: { opacity: 0.85 },
  chipText: { fontSize: 12, color: "#2E3A4D", fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF" },
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
