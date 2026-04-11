import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

type UpcomingSectionHeaderProps = {
  title: string;
};

export function UpcomingSectionHeader({ title }: UpcomingSectionHeaderProps) {
  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { paddingHorizontal: 10, paddingTop: 14, paddingBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
});
