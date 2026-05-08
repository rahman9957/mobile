import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function Register() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("relawan");

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nama,
        email,
        role,
      });

      alert("Akun berhasil dibuat");

      router.replace("/login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#003A8F", "#005BEA"]} style={styles.header}>
        <Text style={styles.title}>Daftar Akun</Text>
        <Text style={styles.subtitle}>Buat akun baru</Text>
      </LinearGradient>

      {/* CARD */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nama"
          value={nama}
          onChangeText={setNama}
        />

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

        {/* ROLE PILIHAN */}
        <Text style={{ marginBottom: 5 }}>Pilih Role:</Text>

        <View style={styles.roleContainer}>
          {["relawan", "pengasuh", "pengurus"].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleActive]}
              onPress={() => setRole(r)}
            >
              <Text
                style={{
                  color: role === r ? "#fff" : "#005BEA",
                }}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>

        {/* LOGIN */}
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Sudah punya akun? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },

  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#D0E2FF" },

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

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  roleButton: {
    borderWidth: 1,
    borderColor: "#005BEA",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 3,
    alignItems: "center",
  },

  roleActive: {
    backgroundColor: "#005BEA",
  },

  button: {
    backgroundColor: "#005BEA",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#005BEA",
  },
});
