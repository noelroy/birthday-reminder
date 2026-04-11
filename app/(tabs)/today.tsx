import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTodaysBirthdays } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { Contact } from "expo-contacts";
import { FlatList, Image, Linking, Pressable, StyleSheet } from "react-native";

// Extract first phone number from contact
const getPhoneNumber = (contact: Contact): string | null => {
  return contact.phoneNumbers?.[0]?.number || null;
};

// Normalize phone for tel: URI
const normalizePhoneForCall = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

// Normalize phone for WhatsApp
const normalizePhoneForWhatsapp = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("1") || digits.length === 11 ? digits : digits.length === 10 ? "1" + digits : digits;
};

// Open call
const callContact = (phone: string) => {
  const normalized = normalizePhoneForCall(phone);
  Linking.openURL(`tel:${normalized}`);
};

// Open WhatsApp chat
const messageOnWhatsapp = (name: string, phone: string) => {
  const normalized = normalizePhoneForWhatsapp(phone);
  Linking.openURL(`whatsapp://send?phone=${normalized}&text=Hi%20${name}!`).catch(() => {
    Linking.openURL(`https://wa.me/${normalized}?text=Hi%20${name}!`);
  });
};

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
      renderItem={({ item }) => {
        const phone = getPhoneNumber(item);

        return (
          <ThemedView style={styles.card}>
            <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
              {item.image?.uri ?
                (<Image source={{ uri: item.image.uri }} style={styles.avatar} />)
                :
                (<ThemedIcon name="person-circle" size={50} style={styles.avatar} />)
              }
              <ThemedView style={styles.cardContent}>
                <ThemedText style={styles.name}>{item.name}</ThemedText>
                <ThemedText style={styles.birthday}>🎂 {item.birthday?.label}</ThemedText>
              </ThemedView>
            </ThemedView>

            {phone && (
              <ThemedView style={styles.actionContainer}>
                <Pressable
                  style={styles.smallButton}
                  onPress={() => callContact(phone)}
                >
                  <ThemedIcon name="call" size={18} />
                  <ThemedText style={styles.buttonLabel}>Call</ThemedText>
                </Pressable>

                <Pressable
                  style={styles.smallButton}
                  onPress={() => messageOnWhatsapp(item.name, phone)}
                >
                  <ThemedIcon name="logo-whatsapp" size={18} />
                  <ThemedText style={styles.buttonLabel}>WhatsApp</ThemedText>
                </Pressable>
              </ThemedView>
            )}
          </ThemedView>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "column", marginVertical: 8, padding: 12, borderRadius: 8, marginHorizontal: 10 },
  cardContent: { flex: 1, marginLeft: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 18, fontWeight: "bold" },
  birthday: { fontSize: 14, marginTop: 4 },
  empty: { textAlign: "center", fontSize: 16, marginTop: 30 },

  // Action buttons
  actionContainer: { flexDirection: "row", gap: 8, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#ccc" },
  smallButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 6, borderRadius: 6, backgroundColor: "#f0f0f0" },
  buttonLabel: { fontSize: 12, marginLeft: 4, fontWeight: "500" },
});
