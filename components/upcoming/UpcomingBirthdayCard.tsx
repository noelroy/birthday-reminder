import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UpcomingItem } from "@/components/upcoming/types";
import { Image, StyleSheet } from "react-native";

type UpcomingBirthdayCardProps = {
  item: UpcomingItem;
};

export function UpcomingBirthdayCard({ item }: UpcomingBirthdayCardProps) {
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
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10, padding: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  birthday: { fontSize: 14, color: "gray" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderLeftWidth: 1, borderLeftColor: "#ccc"
  },
  badgeText: { fontSize: 10 },
});
