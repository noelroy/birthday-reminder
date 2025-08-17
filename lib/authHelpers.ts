import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.warn("Error signing out from Google:", e);
  }
};

export function configureGoogleSignIn() {
  // GoogleSignin.configure({
  //   webClientId: process.env.EXPO_PUBLIC_CLIENT_ID, // from Google Cloud
  //   offlineAccess: true,  // if you want refresh tokens
  // });
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
  });
}
