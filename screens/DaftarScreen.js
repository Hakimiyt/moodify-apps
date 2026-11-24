import { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';
import { AuthContext } from '../lib/auth-context';
import { register } from '../lib/auth';

export default function Daftar({ navigation }) {
  const { setSession } = useContext(AuthContext);
  const [nama, setNama] = useState('');
  const [emel, setEmel] = useState('');
  const [kataLaluan, setKataLaluan] = useState('');
  const [sahkanKataLaluan, setSahkanKataLaluan] = useState('');
  const [sedangDaftar, setSedangDaftar] = useState(false);

  const daftar = async () => {
    if (!nama.trim() || !emel.trim() || !kataLaluan || !sahkanKataLaluan) {
      Alert.alert('Maklumat diperlukan', 'Lengkapkan semua ruangan dahulu.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emel.trim())) {
      Alert.alert('E-mel tidak sah', 'Semak semula alamat e-mel anda.');
      return;
    }
    if (kataLaluan.length < 8) {
      Alert.alert('Kata laluan terlalu pendek', 'Gunakan sekurang-kurangnya 8 aksara.');
      return;
    }
    if (kataLaluan !== sahkanKataLaluan) {
      Alert.alert('Kata laluan tidak sepadan', 'Pastikan kedua-dua kata laluan sama.');
      return;
    }

    try {
      setSedangDaftar(true);
      setSession(await register({ name: nama, email: emel, password: kataLaluan }));
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS') {
        Alert.alert('Akaun sudah wujud', 'E-mel ini telah digunakan. Cuba log masuk.');
      } else {
        console.error('[Moodify] gagal mendaftar:', error);
        Alert.alert('Ralat', 'Tidak dapat membuat akaun. Cuba lagi sebentar.');
      }
    } finally {
      setSedangDaftar(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Pressable style={s.back} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
          <Text style={s.backText}>Kembali</Text>
        </Pressable>

        <View style={s.logoCard}>
          <View style={s.logoMark}><Ionicons name="leaf-outline" size={21} color={C.primary} /></View>
          <View>
            <Text style={s.logoText}>moodify</Text>
            <Text style={s.logoSub}>Sahabat emosi anda</Text>
          </View>
        </View>

        <Text style={s.title}>Cipta akaun.</Text>
        <Text style={s.description}>Mulakan ruang peribadi untuk memahami emosi anda.</Text>

        <View style={s.form}>
          <Field label="Nama" value={nama} onChangeText={setNama} placeholder="Nama anda" />
          <Field
            label="E-mel"
            value={emel}
            onChangeText={setEmel}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Kata laluan"
            value={kataLaluan}
            onChangeText={setKataLaluan}
            placeholder="Sekurang-kurangnya 8 aksara"
            secureTextEntry
            autoCapitalize="none"
          />
          <Field
            label="Sahkan kata laluan"
            value={sahkanKataLaluan}
            onChangeText={setSahkanKataLaluan}
            placeholder="Taip semula kata laluan"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={({ pressed }) => [s.button, pressed && s.pressed, sedangDaftar && s.disabled]}
            onPress={daftar}
            disabled={sedangDaftar}
          >
            <Text style={s.buttonText}>{sedangDaftar ? 'Sedang membuat akaun…' : 'Daftar akaun'}</Text>
            {!sedangDaftar && <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          </Pressable>

          <View style={s.bottomLink}>
            <Text style={s.bottomMuted}>Sudah ada akaun?</Text>
            <Pressable onPress={() => navigation.navigate('LogMasuk')}>
              <Text style={s.link}>Log masuk</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...props}
        style={s.input}
        placeholderTextColor="#AAA4B2"
        autoCorrect={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: C.text, fontSize: 13, fontWeight: '600' },
  logoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  logoText: { color: C.primary, fontSize: 16, fontWeight: '800' },
  logoSub: { color: C.muted, fontSize: 9, marginTop: 1 },
  title: { color: C.text, fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 22 },
  description: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  form: { marginTop: 18, gap: 12 },
  label: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: '#FFFFFF', paddingHorizontal: 14, color: C.text, fontSize: 13 },
  button: { height: 52, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 3 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.7 },
  bottomLink: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  bottomMuted: { color: C.muted, fontSize: 11 },
  link: { color: C.primary, fontSize: 11, fontWeight: '700' },

});
