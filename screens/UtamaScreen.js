import { useCallback, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../lib/auth-context';
import { getRekod } from '../lib/storage';
import { C, iconEmosi } from '../lib/theme';

const NAMA_HARI = ['A', 'I', 'S', 'R', 'K', 'J', 'S'];

export default function Utama({ navigation }) {
  const { session } = useContext(AuthContext);
  const [rekod, setRekod] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getRekod().then(setRekod);
    }, [])
  );

  const akhir = rekod[0];
  const nama = session?.name?.split(' ')[0] || 'anda';
  const tarikhHariIni = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).toUpperCase();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.kandungan}>
        <View style={s.kepala}>
          <View>
            <Text style={s.tarikh}>{tarikhHariIni}</Text>
            <Text style={s.salam}>Hai, {nama} ☀️</Text>
          </View>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{nama.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={s.kadSoalan}>
          <View style={s.barisSoalan}>
            <Text style={s.soalan}>Bagaimana perasaan anda hari ini?</Text>
            <Ionicons name="heart-outline" size={23} color={C.primary} />
          </View>
          <Text style={s.penerangan}>
            Tiada jawapan betul atau salah. Luangkan satu minit untuk diri anda.
          </Text>
          <Pressable style={s.butangUtama} onPress={() => navigation.navigate('Rekod')}>
            <Text style={s.teksButangUtama}>Rekod emosi hari ini</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={s.barisTajuk}>
          <Text style={s.tajukSeksyen}>Imbasan terakhir</Text>
          <Pressable onPress={() => navigation.navigate('Jurnal')}>
            <Text style={s.pautan}>{akhir ? masaRingkas(akhir.tarikh) : 'Lihat jurnal'}</Text>
          </Pressable>
        </View>

        <View style={s.barisKad}>
          <Kotak icon={akhir ? iconEmosi(akhir.emosi) : 'happy-outline'} label="Emosi" nilai={akhir?.emosi || 'Belum ada'} />
          <Kotak icon="pulse-outline" label="Stres" nilai={akhir ? `${akhir.stres} / 5` : '–'} />
          <Kotak icon="flash-outline" label="Tenaga" nilai={akhir ? `${akhir.tenaga} / 5` : '–'} />
        </View>

        <View style={s.barisTajuk}>
          <Text style={s.tajukSeksyen}>Minggu anda</Text>
          <Pressable onPress={() => navigation.navigate('Jurnal')}>
            <Text style={s.pautan}>Lihat jurnal</Text>
          </Pressable>
        </View>

        <View style={s.minggu}>
          {getMinggu(rekod).map((hari) => (
            <View key={hari.tarikh} style={s.hari}>
              {hari.hariIni && !hari.rekod ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tambah rekod hari ini"
                  style={[s.bulat, s.bulatTambah]}
                  onPress={() => navigation.navigate('Rekod')}
                >
                  <Ionicons name="add" size={20} color={C.primary} />
                </Pressable>
              ) : (
                <View style={[s.bulat, hari.rekod && s.bulatAdaRekod]}>
                  <Ionicons
                    name={hari.rekod ? iconEmosi(hari.rekod.emosi) : 'remove-outline'}
                    size={17}
                    color={hari.rekod ? C.primary : C.muted}
                  />
                </View>
              )}
              <Text style={s.labelHari}>{hari.label}</Text>
            </View>
          ))}
        </View>

        <Pressable style={s.kadNafas} onPress={() => navigation.navigate('Aktiviti')}>
          <Ionicons name="leaf-outline" size={24} color={C.primary} />
          <View style={s.teksNafas}>
            <Text style={s.tajukNafas}>Ruang untuk bernafas</Text>
            <Text style={s.peneranganNafas}>2 minit · Rehat sebelum tugasan</Text>
          </View>
          <Ionicons name="arrow-up-outline" size={20} color={C.primary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Kotak({ icon, label, nilai }) {
  return (
    <View style={s.kotak}>
      <Ionicons name={icon} size={19} color={C.primary} />
      <Text style={s.labelKotak}>{label}</Text>
      <Text style={s.nilaiKotak} numberOfLines={1}>{nilai}</Text>
    </View>
  );
}

function getMinggu(rekod) {
  const hariIni = new Date();
  const senaraiHari = [];

  for (let i = 6; i >= 0; i -= 1) {
    const tarikh = new Date();
    tarikh.setDate(hariIni.getDate() - i);

    const rekodHari = rekod.find(
      (item) => new Date(item.tarikh).toDateString() === tarikh.toDateString()
    );

    senaraiHari.push({
      tarikh: tarikh.toISOString(),
      label: NAMA_HARI[tarikh.getDay()],
      hariIni: tarikh.toDateString() === hariIni.toDateString(),
      rekod: rekodHari,
    });
  }

  return senaraiHari;
}

function masaRingkas(tarikh) {
  const hariRekod = new Date(tarikh);
  const semalam = new Date();
  semalam.setDate(semalam.getDate() - 1);

  if (hariRekod.toDateString() === new Date().toDateString()) return 'Hari ini';
  if (hariRekod.toDateString() === semalam.toDateString()) return 'Semalam';
  return hariRekod.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kandungan: { padding: 18, paddingBottom: 24, gap: 18 },
  kepala: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tarikh: { color: C.muted, fontSize: 10, marginBottom: 4 },
  salam: { color: C.text, fontSize: 24, fontWeight: '700' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: C.text, fontSize: 17, fontWeight: '600' },
  kadSoalan: { backgroundColor: C.card, borderRadius: 20, padding: 17, gap: 11 },
  barisSoalan: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  soalan: { flex: 1, color: C.text, fontSize: 19, lineHeight: 24, fontWeight: '700' },
  penerangan: { color: C.muted, fontSize: 12, lineHeight: 18 },
  butangUtama: {
    minHeight: 48,
    backgroundColor: C.primary,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  teksButangUtama: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  barisTajuk: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tajukSeksyen: { color: C.text, fontSize: 16, fontWeight: '700' },
  pautan: { color: C.primary, fontSize: 11, fontWeight: '600' },
  barisKad: { flexDirection: 'row', gap: 8 },
  kotak: { flex: 1, minHeight: 94, backgroundColor: C.card, borderRadius: 17, padding: 12, justifyContent: 'space-between' },
  labelKotak: { color: C.muted, fontSize: 11 },
  nilaiKotak: { color: C.text, fontSize: 13, fontWeight: '700' },
  minggu: { flexDirection: 'row', justifyContent: 'space-between' },
  hari: { alignItems: 'center', gap: 5 },
  bulat: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulatAdaRekod: { backgroundColor: C.sage },
  bulatTambah: { backgroundColor: C.primarySoft },
  labelHari: { color: C.muted, fontSize: 9 },
  kadNafas: {
    minHeight: 66,
    backgroundColor: C.sage,
    borderRadius: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teksNafas: { flex: 1 },
  tajukNafas: { color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 3 },
  peneranganNafas: { color: C.text, fontSize: 10 },
});
