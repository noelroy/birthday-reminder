import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FilterChip } from "@/components/upcoming/FilterChip";
import { UpcomingBirthdayCard } from "@/components/upcoming/UpcomingBirthdayCard";
import { UpcomingSectionHeader } from "@/components/upcoming/UpcomingSectionHeader";
import { UpcomingItem } from "@/components/upcoming/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getUpcomingBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { ScrollView, SectionList, StyleSheet, TextInput } from "react-native";

type UpcomingSection = {
  title: string;
  data: UpcomingItem[];
};

export default function UpcomingScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const borderColor = useThemeColor({}, "border");
  const mutedTextColor = useThemeColor({}, "mutedText");
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

  const sections = filteredUpcoming.reduce<UpcomingSection[]>((acc, item) => {
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
          placeholderTextColor={mutedTextColor}
          style={[styles.searchInput, { borderColor }]}
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
          renderSectionHeader={({ section }) => <UpcomingSectionHeader title={section.title} />}
          renderItem={({ item }) => <UpcomingBirthdayCard item={item} />}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filtersCard: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 4, gap: 10 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  monthChips: { gap: 8, paddingBottom: 6 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 30, fontSize: 16 },
});
