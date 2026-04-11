import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useAppColors } from "@/hooks/useAppColors";
import { getMissingBirthdayContacts } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import * as Contacts from "expo-contacts";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet } from "react-native";

export default function MissingBirthdaysScreen() {
  const contacts = useAppStore((s) => s.contacts);
  const colors = useAppColors();
  const [searchText, setSearchText] = useState("");

  const missingBirthdays = useMemo(() => getMissingBirthdayContacts(contacts), [contacts]);
  const filteredContacts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return missingBirthdays;
    return missingBirthdays.filter((contact) => (contact.name || "").toLowerCase().includes(query));
  }, [missingBirthdays, searchText]);

  const openContact = async (contactId?: string) => {
    if (!contactId) {
      Alert.alert("Contact unavailable", "Unable to open this contact.");
      return;
    }

    try {
      await Contacts.presentFormAsync(contactId);
    } catch (error) {
      console.error("Unable to open contact form:", error);
      Alert.alert("Could not open contact", "Please open your Contacts app and add birthday manually.");
    }
  };

  if (missingBirthdays.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyTitle}>All contacts have birthdays 🎉</ThemedText>
        <ThemedText type="muted">No missing birthday data found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={filteredContacts}
      keyExtractor={(item) => item.id || item.name || Math.random().toString()}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <ThemedTextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search missing contacts"
          style={styles.searchInput}
        />
      }
      ListEmptyComponent={
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>No contacts found</ThemedText>
          <ThemedText type="muted">Try another search term.</ThemedText>
        </ThemedView>
      }
      renderItem={({ item }) => (
        <ThemedView style={[styles.card, { borderColor: colors.border }]}>
          <ThemedView style={styles.row}>
            <ThemedIcon name="person-circle" size={50} />
            <ThemedView style={styles.info}>
              <ThemedText type="defaultSemiBold">{item.name || "Unnamed contact"}</ThemedText>
              <ThemedText type="muted">Birthday missing</ThemedText>
            </ThemedView>
          </ThemedView>

          <Pressable
            onPress={() => openContact(item.id)}
            style={[styles.button, { borderColor: colors.tint }]}
          >
            <ThemedIcon name="create-outline" size={16} lightColor={colors.tint} darkColor={colors.tint} />
            <ThemedText lightColor={colors.tint} darkColor={colors.tint} style={styles.buttonText}>
              Open contact
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 10 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  emptyTitle: { fontSize: 18, marginBottom: 6 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  info: { marginLeft: 10, flex: 1 },
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  buttonText: { fontSize: 13 },
});
