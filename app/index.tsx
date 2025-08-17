import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { readContacts } from "@/lib/dataHelpers";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function SignInScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const contacts = await readContacts();
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
