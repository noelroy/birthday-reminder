import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Linking, Pressable, StyleSheet } from "react-native";

interface TodayActionButtonsProps {
  name: string;
  phone: string;
}

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

export default function TodayActionButtons({ name, phone }: TodayActionButtonsProps) {
  return (
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
        onPress={() => messageOnWhatsapp(name, phone)}
      >
        <ThemedIcon name="logo-whatsapp" size={18} />
        <ThemedText style={styles.buttonLabel}>WhatsApp</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionContainer: { flexDirection: "row", gap: 8, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#ccc" },
  smallButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 6, borderRadius: 6 },
  buttonLabel: { fontSize: 12, marginLeft: 4, fontWeight: "500" },
});
