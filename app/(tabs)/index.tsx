import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { configureGoogleSignIn } from '@/lib/GoogleSignin';
import { Contact } from '@/types/people_types';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes, User } from "@react-native-google-signin/google-signin";


export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(signInResponse)) {
        const userInfo = signInResponse.data;
        setUser(userInfo as User);
      } else {
        // sign in was cancelled by user
        console.log("Sign in cancelled");
      }
      if (signInResponse.type === 'success') {
        const userInfo = signInResponse.data;
        console.log("User Info:", userInfo); // Debugging line
        setUser(userInfo as User); // Cast to User type

        const tokens = await GoogleSignin.getTokens();
        console.log("Access Token:", tokens.accessToken); // Debugging line
        fetchContacts(tokens.accessToken);
      }
    } catch (error) {
      console.log("Sign in error")
      console.log(error);
      if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.log("operation (eg. sign in) already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Android only, play services not available or outdated");
          break;
        default:
        // some other error happened
        console.log("Some other error happened");
      }
    } else {
      // an error that's not related to google sign in occurred
      console.log("an error that's not related to google sign in occurred")
    }
    }
  }

  async function fetchContacts(accessToken: string) {
    try {
      const res = await fetch(
        "https://people.googleapis.com/v1/people/me/connections?personFields=names,birthdays,photos",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await res.json();
      console.log("Contacts Data:", data); // Debugging line
      const parsed = (data.connections || []).map((c) => ({
        id: c.resourceName,
        name: c.names?.[0]?.displayName ?? "Unknown",
        birthday: c.birthdays?.[0]?.date
          ? `${c.birthdays[0].date.month}/${c.birthdays[0].date.day}`
          : "N/A",
        photo: c.photos?.[0]?.url ?? null,
      }));
      setContacts(parsed);
    } catch (err) {
      console.error(err);
    }
  }

  return (
      <ThemedView style={styles.container}>
        {!user ? (
          <Button title="Sign in with Google" onPress={signIn} />
        ) : (
          <>
            <ThemedText style={styles.welcome}>Hello, {user.user.name} 👋</ThemedText>
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ThemedView style={styles.card}>
                  {item.photo && (
                    <Image source={{ uri: item.photo }} style={styles.avatar} />
                  )}
                  <ThemedView>
                    <ThemedText style={styles.name}>{item.name}</ThemedText>
                    <ThemedText style={styles.birthday}>🎂 {item.birthday}</ThemedText>
                  </ThemedView>
                </ThemedView>
              )}
            />
          </>
        )}
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  card: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  birthday: { fontSize: 14, color: "gray" },
  welcome: { fontSize: 20, marginVertical: 20 },
});

