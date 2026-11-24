import { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';
import { AuthContext } from '../lib/auth-context';
import { login } from '../lib/auth';

export default function LogMasuk({ navigation }) {
  const { setSession } = useContext(AuthContext);
  const [emel, setEmel] = useState('');
  const [kataLaluan, setKataLaluan] = useState('');
  const [lihatKataLaluan, setLihatKataLaluan] = useState(false);
  const [sedangLogMasuk, setSedangLogMasuk] = useState(false);

  const masuk = async () => {
    if (!emel.trim() || !kataLaluan) {
      Alert.alert('Maklumat diperlukan', 'Masukkan e-mel dan kata laluan anda.');
      return;
    }
    try {
      setSedangLogMasuk(true);
      setSession(await login(emel, kataLaluan));
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        Alert.alert('Log masuk gagal', 'E-mel atau kata laluan tidak betul.');
      } else {
        console.error('[Moodify] gagal log masuk:', error);
        Alert.alert('Ralat', 'Tidak dapat log masuk. Cuba lagi sebentar.');
      }
    } finally {
      setSedangLogMasuk(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.wrap}>
        <Pressable style={s.back} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
          <Text style={s.backText}>Kembali</Text>
        </Pressable>

        <View style={s.logoCard}>
          <View style={s.logoMark}>
            <Ionicons name="leaf-outline" size={21} color={C.primary} />
          </View>
          <View>
            <Text style={s.logoText}>moodify</Text>
            <Text style={s.logoSub}>Sahabat emosi anda</Text>
          </View>
        </View>

        <View style={s.header}>
          <Text style={s.title}>Selamat kembali.</Text>
          <Text style={s.description}>Ruang untuk berhenti seketika. Sebelum menyambung perjalanan.</Text>
        </View>

        <View style={s.form}>
          <View>
            <Text style={s.label}>E-mel</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                value={emel}
                onChangeText={setEmel}
                placeholder="sbyah@student.edu.my"
                placeholderTextColor="#AAA4B2"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View>
            <Text style={s.label}>Kata laluan</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                value={kataLaluan}
                onChangeText={setKataLaluan}
                placeholder="Masukkan kata laluan"
                placeholderTextColor="#AAA4B2"
                secureTextEntry={!lihatKataLaluan}
                autoCapitalize="none"
                autoComplete="password"
              />
              <Pressable
                style={s.eye}
                onPress={() => setLihatKataLaluan((value) => !value)}
                hitSlop={8}
              >
                <Ionicons name={lihatKataLaluan ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => Alert.alert('Pulihkan kata laluan', 'Akaun ini disimpan pada peranti sahaja dan tiada pemulihan kata laluan automatik.')}
          >
            <Text style={s.forgot}>Lupa kata laluan?</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.loginButton, pressed && s.pressed, sedangLogMasuk && s.disabled]}
            onPress={masuk}
            disabled={sedangLogMasuk}
          >
            <Text style={s.loginText}>{sedangLogMasuk ? 'Sedang log masuk…' : 'Log masuk'}</Text>
            {!sedangLogMasuk && <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          </Pressable>

          <View style={s.bottomLink}>
            <Text style={s.bottomMuted}>Baru di sini?</Text>
            <Pressable onPress={() => navigation.navigate('Daftar')}>
              <Text style={s.daftar}>Daftar akaun</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.support}>
          <View style={s.supportIcon}>
            <Ionicons name="shield-checkmark-outline" size={19} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.supportTitle}>Anda tidak bersendirian</Text>
            <Text style={s.supportText}>
              Rekod emosi anda selamat dan rahsia. Untuk bantuan serius, hubungi unit kaunseling kampus.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },
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
    shadowColor: '#5E5570',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: { color: C.primary, fontSize: 16, fontWeight: '800' },
  logoSub: { color: C.muted, fontSize: 9, marginTop: 1 },
  header: { marginTop: 26 },
  title: { color: C.text, fontSize: 30, lineHeight: 36, fontWeight: '800' },
  description: { color: C.muted, fontSize: 12, lineHeight: 18, maxWidth: 280, marginTop: 6 },
  form: { marginTop: 22, gap: 12 },
  label: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 7 },
  inputWrap: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  input: { flex: 1, paddingHorizontal: 14, paddingRight: 46, color: C.text, fontSize: 13 },
  eye: { position: 'absolute', right: 12, height: '100%', justifyContent: 'center' },
  forgot: { color: C.primary, fontSize: 11, fontWeight: '700', alignSelf: 'flex-end', marginTop: -2 },
  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.7 },
  loginText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bottomLink: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  bottomMuted: { color: C.muted, fontSize: 11 },
  daftar: { color: C.primary, fontSize: 11, fontWeight: '700' },
  support: {
    marginTop: 18,
    minHeight: 78,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  supportIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  supportTitle: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  supportText: { color: C.muted, fontSize: 9, lineHeight: 13 },
  terms: { color: C.muted, textAlign: 'center', fontSize: 8, marginTop: 8 },
});
