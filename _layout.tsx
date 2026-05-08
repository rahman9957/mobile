import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // mengambil data user dari Firestore
          const docRef = doc(db, "users", u.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();
            setUser({ ...u, role: data.role });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.log("Error ambil user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // loading
  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {!user ? (
          <>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </>
        ) : user.role === "relawan" ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : user.role === "pengasuh" ? (
          <Stack.Screen name="pengasuh" options={{ headerShown: false }} />
        ) : user.role === "pengurus" ? (
          <Stack.Screen name="pengurus" options={{ headerShown: false }} />
        ) : (
          
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
