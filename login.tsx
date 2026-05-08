import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Isi email dan password dulu");
      return;
    }

    try {
      // 🔥 LOGIN FIREBASE
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // 🔥 AMBIL DATA USER (ROLE)
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Data user tidak ditemukan");
        return;
      }

      const data = docSnap.data();
      const role = data.role;

      console.log("Role:", role);

      // 🔥 REDIRECT SESUAI ROLE
      if (role === "relawan") {
        router.replace("/(tabs)");
      } else if (role === "pengasuh") {
        router.replace("/pengasuh");
      } else if (role === "pengurus") {
        router.replace("/pengurus");
      } else {
        alert("Role tidak dikenali");
      }
    } catch (error: any) {
      console.log(error);
      alert("Login gagal: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <LinearGradient colors={["#003A8F", "#005BEA"]} style={styles.header}>
          <Text style={styles.title}>Mutiara Finance</Text>
          <Text style={styles.subtitle}>Login ke akun kamu</Text>
        </LinearGradient>

        {/* CARD */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* LOGIN */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* REGISTER */}
          <TouchableOpacity onPress={() => router.replace("/register")}>
            <Text style={styles.link}>Belum punya akun? Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#D0E2FF",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },

  input: {
    backgroundColor: "#F1F3F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#005BEA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#005BEA",
  },
});
