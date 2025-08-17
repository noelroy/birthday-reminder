import { GoogleSignin } from '@react-native-google-signin/google-signin';


export function configureGoogleSignIn() {
  // GoogleSignin.configure({
  //   webClientId: process.env.EXPO_PUBLIC_CLIENT_ID, // from Google Cloud
  //   offlineAccess: true,  // if you want refresh tokens
  // });
  GoogleSignin.configure();
}
