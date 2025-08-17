import { configureGoogleSignIn } from "@/lib/authHelpers";
import { useAppStore } from "@/lib/store";
import { Contact, PeopleAPIResponse } from "@/types/people_types";
import { GoogleSignin, isSuccessResponse, User } from "@react-native-google-signin/google-signin";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function SignInScreen() {
  const setUser = useAppStore((s) => s.setUser);
  const setContacts = useAppStore((s) => s.setContacts);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(signInResponse)) {
              const userInfo = signInResponse.data;
              console.log("Sign in successful:");
              setUser(userInfo as User);
              const { accessToken } = await GoogleSignin.getTokens();
              await fetchContacts(accessToken);
            } else {
              // sign in was cancelled by user
              console.log("Sign in cancelled");
            }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  const fetchContacts = async (accessToken: string) => {
    try {
      const res = await fetch(
        "https://people.googleapis.com/v1/people/me/connections?pageSize=1000&personFields=names,birthdays,photos",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data: PeopleAPIResponse = await res.json();
      console.log("Contacts fetched: ", data.connections?.length || 0);
      const parsed: Contact[] = (data.connections || []).map((c) => ({
          id: c.resourceName,
          name: c.names?.[0]?.displayName ?? "Unknown",
          birthday: c.birthdays?.[0]?.date
            ? `${c.birthdays[0].date.month}/${c.birthdays[0].date.day}`
            : "N/A",
          photo: c.photos?.[0]?.url ?? undefined,
        }));


      setContacts(parsed);
    } catch (err) {
      console.error("Fetch contacts error:", err);
    }
  };

  return (
    user ? <Redirect href="/today" /> :
    <View style={styles.container}>
      <Button title="Sign in with Google new" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
