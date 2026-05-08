import { router, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

type RiwayatItem = {
  tanggal: string;
  nama: string;
  hasil: number;
};

export default function Home() {
  const [nama, setNama] = useState("");
  const [ambil, setAmbil] = useState("");
  const [titip, setTitip] = useState("");
  const [total, setTotal] = useState("402500");
  const [bop, setBop] = useState("75000");
  const [persen, setPersen] = useState("10");

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const [date, setDate] = useState(new Date());
  const [tanggal, setTanggal] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [pengeluaran, setPengeluaran] = useState<
    { ket: string; nominal: string }[]
  >([]);

  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await AsyncStorage.getItem("laporan");
    if (data) setRiwayat(JSON.parse(data));
  };

  const safeNumber = (val: string) => Number(val || 0);

  // ==== PERHITUNGAN ====
  const sementara = safeNumber(total) - safeNumber(bop);
  const regulasi = Math.floor((sementara * safeNumber(persen)) / 100);
  const akhir = sementara - regulasi;

  const totalPengeluaran = pengeluaran.reduce(
    (sum, item) => sum + safeNumber(item.nominal),
    0,
  );

  const bersih = akhir - totalPengeluaran;

  // ==== SIMPAN ====
  const simpanData = async () => {
    try {
      const dataBaru = {
        tanggal,
        nama,
        hasil: bersih,
      };

      await addDoc(collection(db, "keuangan"), dataBaru);

      const dataLama = await AsyncStorage.getItem("laporan");
      const parsed = dataLama ? JSON.parse(dataLama) : [];

      parsed.push(dataBaru);
      await AsyncStorage.setItem("laporan", JSON.stringify(parsed));

      setRiwayat(parsed);

      alert("Data berhasil disimpan");
    } catch (e) {
      console.log(e);
    }
  };

  const tambahPengeluaran = () => {
    setPengeluaran([...pengeluaran, { ket: "", nominal: "" }]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#003A8F", "#005BEA"]} style={styles.header}>
        <Text style={styles.title}>Mutiara Finance</Text>
        <Text style={styles.subtitle}>Kelola Keuangan Relawan</Text>
      </LinearGradient>

      {/* FORM */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={{ marginLeft: 10 }}>
            {tanggal ? tanggal : "Pilih Tanggal"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
                setTanggal(selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}

        <Input
          icon="person"
          value={nama}
          setValue={setNama}
          placeholder="Nama Relawan"
        />
        <Input
          icon="water"
          value={ambil}
          setValue={setAmbil}
          placeholder="Pengambilan (KL)"
        />
        <Input
          icon="cube"
          value={titip}
          setValue={setTitip}
          placeholder="Penitipan (KL)"
        />
        <Input
          icon="cash"
          value={total}
          setValue={setTotal}
          placeholder="Total (Rp)"
        />
        <Input
          icon="wallet"
          value={bop}
          setValue={setBop}
          placeholder="BOP (Rp)"
        />
        <Input
          icon="stats-chart"
          value={persen}
          setValue={setPersen}
          placeholder="Persen (%)"
        />
      </View>

      {/* HASIL */}
      <View style={styles.card}>
        <Hasil label="Hasil Sementara" value={sementara} />
        <Hasil label="Regulasi" value={regulasi} />
        <Hasil label="Hasil Akhir" value={akhir} />
      </View>

      {/* PENGELUARAN */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pengeluaran</Text>

        {pengeluaran.map((item, index) => (
          <View key={index} style={styles.row}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Keterangan"
              value={item.ket}
              onChangeText={(text) => {
                const newData = [...pengeluaran];
                newData[index].ket = text;
                setPengeluaran(newData);
              }}
            />
            <TextInput
              style={styles.inputFlex}
              placeholder="Nominal"
              keyboardType="numeric"
              value={item.nominal}
              onChangeText={(text) => {
                const newData = [...pengeluaran];
                newData[index].nominal = text;
                setPengeluaran(newData);
              }}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={tambahPengeluaran}
        >
          <Text style={styles.buttonText}>+ Tambah</Text>
        </TouchableOpacity>

        <Hasil label="Total Pengeluaran" value={totalPengeluaran} />
        <Hasil label="Hasil Bersih" value={bersih} />
      </View>

      {/* RIWAYAT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Riwayat</Text>

        {riwayat.map((item, index) => (
          <Text key={index}>
            {item.tanggal} - {item.nama} - Rp{" "}
            {Number(item.hasil).toLocaleString("id-ID")}
          </Text>
        ))}
      </View>

      {/* BUTTON SIMPAN */}
      <TouchableOpacity style={styles.button} onPress={simpanData}>
        <Text style={styles.buttonText}>Simpan Laporan</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#E53935" }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ===== INPUT =====
function Input({ icon, value, setValue, placeholder }: any) {
  return (
    <View style={styles.inputGroup}>
      <Ionicons name={icon} size={20} color="#666" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
}

// ===== HASIL =====
function Hasil({ label, value }: any) {
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>
        Rp {Number(value).toLocaleString("id-ID")}
      </Text>
    </View>
  );
}

// ===== STYLE =====
const styles = StyleSheet.create({
  container: { backgroundColor: "#F4F6FA", flex: 1 },

  header: {
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#D0E2FF" },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 20,
    elevation: 5,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  input: { flex: 1, padding: 12 },

  row: { flexDirection: "row", gap: 10, marginBottom: 10 },

  inputFlex: {
    flex: 1,
    backgroundColor: "#F1F3F6",
    borderRadius: 10,
    padding: 10,
  },

  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  resultBox: {
    backgroundColor: "#003A8F",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
  },

  resultLabel: { color: "#B0C4DE" },
  resultValue: { color: "#FFD700", fontSize: 20, fontWeight: "bold" },

  button: {
    backgroundColor: "#005BEA",
    margin: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonSmall: {
    backgroundColor: "#005BEA",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },

  buttonText: { color: "#fff", fontWeight: "bold" },
});
