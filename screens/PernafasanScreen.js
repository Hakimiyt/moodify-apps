import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';

const LANGKAH = [
  { tajuk: 'Duduk dengan selesa', butiran: 'Letakkan kaki dan bahu dalam keadaan santai.' },
  { tajuk: 'Tarik nafas selama 4 saat', butiran: 'Kemudian hembus perlahan selama 6 saat.' },
  { tajuk: 'Ulang mengikut keselesaan', butiran: 'Bernafas seperti biasa jika terasa terlalu lama.' },
];

export default function Pernafasan({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.kandungan}>
        <Pressable style={s.kembali} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color={C.text} />
          <Text style={s.teksKembali}>Kembali</Text>
        </Pressable>

        <Text style={s.kicker}>AKTIVITI MINI · PERNAFASAN</Text>
        <Text style={s.tajuk}>Ruang untuk bernafas</Text>

        <View style={s.bulatanLuar}>
          <View style={s.bulatanTengah}>
            <View style={s.bulatanIkon}>
              <Ionicons name="leaf-outline" size={30} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={s.pilihan}>
          <Text style={s.pil}>2 minit</Text>
          <Text style={s.pil}>Tanpa audio</Text>
          <Text style={s.pil}>Duduk selesa</Text>
        </View>

        <Text style={s.penerangan}>
          Berhenti seketika daripada tugasan. Ikut bulatan dan bernafas secara perlahan.
        </Text>

        <View style={s.senaraiLangkah}>
          {LANGKAH.map((langkah, index) => (
            <View key={langkah.tajuk} style={s.barisLangkah}>
              <View style={s.nombor}>
                <Text style={s.teksNombor}>{index + 1}</Text>
              </View>
              <View style={s.teksLangkah}>
                <Text style={s.tajukLangkah}>{langkah.tajuk}</Text>
                <Text style={s.butiranLangkah}>{langkah.butiran}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.nota}>
          <Ionicons name="information-circle-outline" size={16} color={C.muted} />
          <Text style={s.teksNota}>Jika pening atau tidak selesa, berhenti dan kembali bernafas seperti biasa.</Text>
        </View>

        <Pressable style={s.butang} onPress={() => navigation.navigate('SesiPernafasan')}>
          <Text style={s.teksButang}>Mulakan sesi</Text>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kandungan: { flexGrow: 1, padding: 18, paddingBottom: 22, gap: 12 },
  kembali: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 5 },
  teksKembali: { color: C.text, fontSize: 11 },
  kicker: { color: C.primary, fontSize: 9, fontWeight: '700' },
  tajuk: { color: C.text, fontSize: 22, fontWeight: '700' },
  bulatanLuar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F0EDF3',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
  },
  bulatanTengah: { width: 112, height: 112, borderRadius: 56, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  bulatanIkon: { width: 70, height: 70, borderRadius: 35, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  pilihan: { flexDirection: 'row', justifyContent: 'center', gap: 7 },
  pil: { color: C.text, backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6, fontSize: 9 },
  penerangan: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 2 },
  senaraiLangkah: { gap: 10, marginTop: 2 },
  barisLangkah: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  nombor: { width: 19, height: 19, borderRadius: 10, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  teksNombor: { color: C.text, fontSize: 9, fontWeight: '700' },
  teksLangkah: { flex: 1, gap: 2 },
  tajukLangkah: { color: C.text, fontSize: 10, fontWeight: '600' },
  butiranLangkah: { color: C.muted, fontSize: 9 },
  nota: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 'auto' },
  teksNota: { flex: 1, color: C.muted, fontSize: 8, lineHeight: 12 },
  butang: { minHeight: 48, backgroundColor: C.primary, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  teksButang: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
