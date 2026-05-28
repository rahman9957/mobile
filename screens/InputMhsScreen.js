import React, { useState } from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export default function InputMhsScreen() {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");

  async function simpanData() {
    try {
      await addDoc(
        collection(db, "mahasiswa"),
        {
          nim,
          nama,
          jurusan,
        }
      );

      Alert.alert(
        "Berhasil",
        "Data tersimpan"
      );

      setNim("");
      setNama("");
      setJurusan("");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Masukkan NIM"
        style={styles.input}
        value={nim}
        onChangeText={setNim}
      />

      <TextInput
        placeholder="Masukkan Nama"
        style={styles.input}
        value={nama}
        onChangeText={setNama}
      />

      <TextInput
        placeholder="Masukkan Jurusan"
        style={styles.input}
        value={jurusan}
        onChangeText={setJurusan}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={simpanData}
      >
        <Text style={styles.textBtn}>
          Simpan
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  input: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#0A2D5E",
    padding: 18,
    borderRadius: 15,
  },

  textBtn: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

});