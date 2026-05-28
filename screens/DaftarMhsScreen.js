import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export default function DaftarMhsScreen() {
  const [data, setData] = useState([]);

  async function loadData() {
    const snap = await getDocs(
      collection(db, "mahasiswa")
    );

    let arr = [];

    snap.forEach((item) => {
      arr.push({
        id: item.id,
        ...item.data(),
      });
    });

    setData(arr);
  }

  async function hapus(id) {
    await deleteDoc(
      doc(
        db,
        "mahasiswa",
        id
      )
    );

    loadData();
  }

  async function editData(item) {
    await updateDoc(
      doc(
        db,
        "mahasiswa",
        item.id
      ),
      {
        nama:
          item.nama +
          " (Edit)",
      }
    );

    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nama}>
              {item.nama}
            </Text>

            <Text>
              NIM : {item.nim}
            </Text>

            <Text>
              Jurusan :
              {item.jurusan}
            </Text>

            <TouchableOpacity
              style={
                styles.editBtn
              }
              onPress={() =>
                editData(item)
              }
            >
              <Text
                style={
                  styles.btnText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.hapusBtn
              }
              onPress={() =>
                hapus(item.id)
              }
            >
              <Text
                style={
                  styles.btnText
                }
              >
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor:
        "#F4F6FA",
    },

    card: {
      backgroundColor:
        "#FFF",
      padding: 18,
      marginBottom: 15,
      borderRadius: 20,
      elevation: 5,
    },

    nama: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#0A2D5E",
      marginBottom: 8,
    },

    editBtn: {
      backgroundColor:
        "#FFC72C",
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
    },

    hapusBtn: {
      backgroundColor:
        "#D9534F",
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
    },

    btnText: {
      color: "#FFF",
      textAlign: "center",
      fontWeight: "bold",
    },
  });