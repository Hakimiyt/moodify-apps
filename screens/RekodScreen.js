import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, EMOSI, FAKTOR } from '../lib/theme';
import { tambahRekod } from '../lib/storage';

export default function RekodEmosi({ navigation }) {
  const [emosi, setEmosi] = useState('');
  const [stres, setStres] = useState(3);
  const [tenaga, setTenaga] = useState(3);
  const [faktor, setFaktor] = useState('Tugasan');
  const [catatan, setCatatan] = useState('');

  const simpan = async () => {
    if (!emosi) {
      Alert.alert('Pilih emosi', 'Sila pilih emosi anda dahulu.');
      return;
    }
    try {
      await tambahRekod({ emosi, stres, tenaga, faktor, catatan: catatan.trim() });
      navigation.replace('Disimpan');
    } catch (e) {
      console.log('[Moodify] ralat simpan:', e);
      Alert.alert('Gagal menyimpan', 'Cuba lagi sebentar.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
          <Text style={s.backText}>Kembali</Text>
        </Pressable>
        <Text style={s.title}>Apa yang anda rasa?</Text>

        <Text style={s.label}>Pilih emosi anda</Text>
        <View style={s.row}>
          {EMOSI.map((e) => {
            const on = emosi === e.key;
            return (
              <Pressable key={e.key} onPress={() => setEmosi(e.key)} style={[s.emo, on && s.emoOn]}>
                <Ionicons name={e.icon} size={22} color={on ? '#fff' : C.primary} />
                <Text style={[s.emoText, on && { color: '#fff' }]}>{e.key}</Text>
              </Pressable>
            );
          })}
        </View>

        <Skala label="Tahap stres" nilai={stres} set={setStres} />
        <Skala label="Tahap tenaga" nilai={tenaga} set={setTenaga} />

        <Text style={s.label}>Apa yang mempengaruhi anda?</Text>
        <View style={s.row}>
          {FAKTOR.map((f) => (
            <Pressable key={f} onPress={() => setFaktor(f)} style={[s.chip, faktor === f && s.chipOn]}>
              <Text style={[s.chipText, faktor === f && { color: '#fff' }]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Catatan ringkas (pilihan)</Text>
        <TextInput
          style={s.input}
          multiline
          value={catatan}
          onChangeText={setCatatan}
          placeholder="Tulis apa yang anda rasa..."
          placeholderTextColor={C.muted}
        />

        <Pressable style={s.btn} onPress={simpan}>
          <Text style={s.btnText}>Simpan rekod</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Skala({ label, nilai, set }) {
  return (
    <View>
      <Text style={s.label}>{label}: {nilai} / 5</Text>
      <View style={s.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => set(n)} style={[s.num, nilai === n && s.numOn]}>
            <Text style={[s.numText, nilai === n && { color: '#fff' }]}>{n}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { padding: 20, gap: 12 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: C.text },
  title: { fontSize: 26, fontWeight: '700', color: C.text },
  label: { fontSize: 14, fontWeight: '600', color: C.text, marginTop: 6, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  emo: { width: '18%', minWidth: 60, alignItems: 'center', gap: 4, paddingVertical: 10, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  emoOn: { backgroundColor: C.primary, borderColor: C.primary },
  emoText: { fontSize: 11, color: C.text },
  num: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  numOn: { backgroundColor: C.primary, borderColor: C.primary },
  numText: { fontWeight: '700', color: C.text },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.primarySoft },
  chipOn: { backgroundColor: C.primary },
  chipText: { color: C.primary, fontWeight: '600', fontSize: 13 },
  input: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, minHeight: 90, padding: 12, textAlignVertical: 'top', color: C.text },
  btn: { backgroundColor: C.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
});
