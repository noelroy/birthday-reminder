import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { readContacts } from "@/lib/dataHelpers";
import { useAppStore } from "@/lib/store";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function SignInScreen() {
  const setContacts = useAppStore((s) => s.setContacts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const contacts = await readContacts();
      setContacts(contacts);
      setLoading(false);
    })();
  }, []);

  return (
    loading ? <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView> :
      <Redirect href="/today" />

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
