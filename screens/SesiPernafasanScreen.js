import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';

const TEMPOH_SESI = 120;

export default function SesiPernafasan({ navigation }) {
  const [baki, setBaki] = useState(TEMPOH_SESI);
  const [berjalan, setBerjalan] = useState(true);
  const bakiSemasa = useRef(TEMPOH_SESI);

  useEffect(() => {
    if (!berjalan) return undefined;

    const pemasa = setInterval(() => {
      const masa = Math.max(bakiSemasa.current - 1, 0);
      bakiSemasa.current = masa;
      setBaki(masa);

      if (masa === 0) {
        clearInterval(pemasa);
        setBerjalan(false);
      }
    }, 1000);

    return () => clearInterval(pemasa);
  }, [berjalan, navigation]);

  const masaBerlalu = TEMPOH_SESI - baki;
  const masaFasa = masaBerlalu % 10;
  const sedangTarikNafas = masaFasa < 4;
  const tajukFasa = sedangTarikNafas ? 'Tarik nafas' : 'Hembus perlahan';
  const arahanFasa = sedangTarikNafas
    ? 'Tarik 4 saat · Hembus 6 saat'
    : 'Hembus perlahan-lahan';
  let teksPenerangan = 'Lepaskan nafas dengan tenang.';
  let teksButang = 'Sambung sesi';
  let ikonButang = 'play';

  if (sedangTarikNafas) teksPenerangan = 'Tarik nafas perlahan-lahan.';
  if (berjalan) {
    teksButang = 'Hentikan sesi';
    ikonButang = 'pause';
  }
  if (baki === 0) {
    teksPenerangan = 'Bagus kerana meluangkan masa untuk diri sendiri.';
    teksButang = 'Kembali ke aktiviti';
    ikonButang = 'checkmark';
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.kandungan}>
        <Pressable style={s.kembali} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={C.text} />
          <Text style={s.teksKembali}>Kembali</Text>
        </Pressable>

        <Text style={s.kicker}>SESI PERNAFASAN</Text>
        <Text style={s.tajuk}>Satu nafas pada satu masa</Text>
        <Text style={s.penerangan}>Ikut rentak yang selesa untuk anda.</Text>

        <View style={s.bulatanLuar}>
          <View style={s.bulatanTengah}>
            <View style={s.bulatanDalam}>
              <Text style={s.teksFasa}>{baki === 0 ? 'Selesai' : tajukFasa}</Text>
            </View>
          </View>
        </View>

        <Text style={s.arahan}>{baki === 0 ? 'Sesi 2 minit selesai' : arahanFasa}</Text>
        <Text style={s.peneranganFasa}>{teksPenerangan}</Text>

        <Text style={s.pemasa}>{formatMasa(baki)}</Text>
        <View style={s.barLatar}>
          <View style={[s.barKemajuan, { width: `${(masaBerlalu / TEMPOH_SESI) * 100}%` }]} />
        </View>
        <Text style={s.labelKemajuan}>Baki sesi · Jumlah 2 minit</Text>

        <Pressable
          style={[s.butang, baki === 0 && s.butangSelesai]}
          onPress={() => (baki === 0 ? navigation.goBack() : setBerjalan((nilai) => !nilai))}
        >
          <Ionicons name={ikonButang} size={15} color="#FFFFFF" />
          <Text style={s.teksButang}>{teksButang}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={s.butangTamat}>
          <Text style={s.teksButangTamat}>Tamatkan sesi</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function formatMasa(jumlahSaat) {
  const minit = Math.floor(jumlahSaat / 60);
  const saat = jumlahSaat % 60;
  return `${String(minit).padStart(2, '0')}:${String(saat).padStart(2, '0')}`;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kandungan: { flex: 1, alignItems: 'center', padding: 18 },
  kembali: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 14 },
  teksKembali: { color: C.text, fontSize: 11 },
  kicker: { color: C.primary, fontSize: 9, fontWeight: '700', alignSelf: 'flex-start' },
  tajuk: { color: C.text, fontSize: 22, fontWeight: '700', alignSelf: 'flex-start', marginTop: 5 },
  penerangan: { color: C.muted, fontSize: 11, marginTop: 7 },
  bulatanLuar: { width: 158, height: 158, borderRadius: 79, backgroundColor: '#F0EDF3', alignItems: 'center', justifyContent: 'center', marginTop: 25 },
  bulatanTengah: { width: 122, height: 122, borderRadius: 61, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  bulatanDalam: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', padding: 8 },
  teksFasa: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  arahan: { color: C.primary, fontSize: 11, fontWeight: '600', marginTop: 22 },
  peneranganFasa: { color: C.muted, fontSize: 9, marginTop: 5 },
  pemasa: { color: C.text, fontSize: 26, fontWeight: '700', marginTop: 18 },
  barLatar: { width: '70%', height: 3, borderRadius: 2, backgroundColor: C.border, marginTop: 10, overflow: 'hidden' },
  barKemajuan: { height: '100%', backgroundColor: C.primary },
  labelKemajuan: { color: C.muted, fontSize: 8, marginTop: 7 },
  butang: { width: '100%', minHeight: 46, borderRadius: 12, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 'auto' },
  butangSelesai: { backgroundColor: '#63856C' },
  teksButang: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  butangTamat: { padding: 12 },
  teksButangTamat: { color: C.primary, fontSize: 10 },
});
