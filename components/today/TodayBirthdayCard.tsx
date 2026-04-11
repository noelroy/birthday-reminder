import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Contact } from "expo-contacts";
import { Image, StyleSheet } from "react-native";
import TodayActionButtons from "./TodayActionButtons";

interface TodayBirthdayCardProps {
  item: Contact;
}

// Extract first phone number from contact
const getPhoneNumber = (contact: Contact): string | null => {
  return contact.phoneNumbers?.[0]?.number || null;
};

export default function TodayBirthdayCard({ item }: TodayBirthdayCardProps) {
  const phone = getPhoneNumber(item);

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.row}>
        {item.image?.uri ?
          (<Image source={{ uri: item.image.uri }} style={styles.avatar} />)
          :
          (<ThemedIcon name="person-circle" size={50} style={styles.avatar} />)
        }
        <ThemedView style={styles.info}>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText type="muted">🎂 Today</ThemedText>
        </ThemedView>
      </ThemedView>

      {phone && <TodayActionButtons name={item.name} phone={phone} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: "column",
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    gap:10 
  },
  row: { flexDirection: "row", alignItems: "center" },
  info: { flex: 1, marginLeft: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
});
