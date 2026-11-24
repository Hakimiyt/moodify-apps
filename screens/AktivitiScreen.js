import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';

const KATEGORI = ['Semua', 'Pernafasan', 'Audio', 'Rehat'];

const aktiviti = [
  { tajuk: 'Bunyi hujan lembut', kategori: 'Audio', butiran: 'Audio relaksasi · 5 minit', icon: 'headset-outline' },
  { tajuk: 'Regangan di meja', kategori: 'Rehat', butiran: 'Rehat belajar · 3 minit', icon: 'reorder-two-outline' },
  { tajuk: 'Rehatkan mata', kategori: 'Rehat', butiran: 'Rehat belajar · 1 minit', icon: 'eye-outline' },
];

export default function Aktiviti({ navigation }) {
  const [kategoriDipilih, setKategoriDipilih] = useState('Semua');
  const senaraiAktiviti = aktiviti.filter(
    (item) => kategoriDipilih === 'Semua' || item.kategori === kategoriDipilih
  );
  const tunjukPernafasan = kategoriDipilih === 'Semua' || kategoriDipilih === 'Pernafasan';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.kandungan}>
        <Text style={s.kicker}>AKTIVITI MINI</Text>
        <Text style={s.tajuk}>Rehat kecil, rasa lega.</Text>
        <Text style={s.penerangan}>Pilih satu ruang rehat di antara waktu belajar.</Text>

        <View style={s.senaraiKategori}>
          {KATEGORI.map((kategori) => {
            const aktif = kategori === kategoriDipilih;
            return (
              <Pressable
                key={kategori}
                style={[s.chip, aktif && s.chipAktif]}
                onPress={() => setKategoriDipilih(kategori)}
              >
                <Text style={[s.teksChip, aktif && s.teksChipAktif]}>{kategori}</Text>
              </Pressable>
            );
          })}
        </View>

        {tunjukPernafasan && (
          <Pressable style={s.kadUtama} onPress={() => navigation.navigate('Pernafasan')}>
            <View style={s.kadUtamaTeks}>
              <Text style={s.labelKad}>MULA DI SINI</Text>
              <Text style={s.tajukKadUtama}>Ruang untuk bernafas</Text>
              <Text style={s.butiranKad}>2 minit · Ikut rentak anda</Text>
              <Text style={s.pautan}>Lihat aktiviti →</Text>
            </View>
            <View style={s.ikonBulat}>
              <Ionicons name="leaf-outline" size={25} color={C.primary} />
            </View>
          </Pressable>
        )}

        <Text style={s.tajukSeksyen}>Untuk waktu rehat anda</Text>
        {senaraiAktiviti.map((item) => (
          <Pressable
            key={item.tajuk}
            style={s.kadSenarai}
            onPress={() => Alert.alert(item.tajuk, item.butiran)}
          >
            <View style={s.ikonSenarai}>
              <Ionicons name={item.icon} size={20} color={C.primary} />
            </View>
            <View style={s.teksSenarai}>
              <Text style={s.tajukSenarai}>{item.tajuk}</Text>
              <Text style={s.butiranSenarai}>{item.butiran}</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color={C.primary} />
          </Pressable>
        ))}

        <Text style={s.nota}>Tak perlu buat semuanya. Satu pun sudah memadai.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kandungan: { padding: 18, paddingBottom: 24, gap: 12 },
  kicker: { color: C.primary, fontSize: 9, fontWeight: '700' },
  tajuk: { color: C.text, fontSize: 23, lineHeight: 29, fontWeight: '700' },
  penerangan: { color: C.muted, fontSize: 12 },
  senaraiKategori: { flexDirection: 'row', gap: 7, marginTop: 4, marginBottom: 2 },
  chip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 16, backgroundColor: C.card },
  chipAktif: { backgroundColor: C.primary },
  teksChip: { color: C.text, fontSize: 10 },
  teksChipAktif: { color: '#FFFFFF', fontWeight: '600' },
  kadUtama: {
    minHeight: 100,
    backgroundColor: C.sage,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kadUtamaTeks: { flex: 1, gap: 4 },
  labelKad: { color: C.muted, fontSize: 8, fontWeight: '700' },
  tajukKadUtama: { color: C.text, fontSize: 14, fontWeight: '700' },
  butiranKad: { color: C.text, fontSize: 9 },
  pautan: { color: C.primary, fontSize: 9, marginTop: 2 },
  ikonBulat: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  tajukSeksyen: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 5 },
  kadSenarai: {
    minHeight: 60,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  ikonSenarai: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  teksSenarai: { flex: 1, gap: 3 },
  tajukSenarai: { color: C.text, fontSize: 11, fontWeight: '600' },
  butiranSenarai: { color: C.muted, fontSize: 9 },
  nota: { color: C.muted, fontSize: 9, textAlign: 'center', marginTop: 2 },
});
