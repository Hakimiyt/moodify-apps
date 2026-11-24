import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';

export default function SelamatDatang({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.wrap}>
        <View style={s.hero}>
          <View style={s.sun} />
          <View style={s.cloudOne}><Ionicons name="cloud" size={46} color="#F7F3EE" /></View>
          <View style={s.cloudTwo}><Ionicons name="cloud" size={34} color="#EDE4D7" /></View>
          <View style={s.person}>
            <View style={s.hair} />
            <View style={s.face}>
              <View style={s.eyeLeft} />
              <View style={s.eyeRight} />
            </View>
            <View style={s.body} />
            <View style={s.legLeft} />
            <View style={s.legRight} />
          </View>
          <View style={s.mat} />
          <View style={s.plant}>
            <Ionicons name="leaf" size={28} color="#6E8A67" />
            <View style={s.pot} />
          </View>
        </View>

        <View style={s.content}>
          <Text style={s.kicker}>RUANG KOLABORATIF BERSAMA</Text>
          <Text style={s.title}>Apa khabar,{'\n'}diri hari ini?</Text>
          <Text style={s.description}>
            Di setiap kecil dan tugasan, anda boleh lebih untuk memahami perasaan anda.
          </Text>

          <View style={s.steps}>
            <View style={s.step}>
              <View style={s.stepIcon}><Ionicons name="sparkles-outline" size={16} color={C.primary} /></View>
              <Text style={s.stepText}>Rekod emosi</Text>
            </View>
            <View style={s.step}>
              <View style={s.stepIcon}><Ionicons name="pulse-outline" size={16} color={C.primary} /></View>
              <Text style={s.stepText}>Rehat 2 minit</Text>
            </View>
            <View style={s.step}>
              <View style={s.stepIcon}><Ionicons name="trending-up-outline" size={16} color={C.primary} /></View>
              <Text style={s.stepText}>Ruang refleksi</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [s.primaryButton, pressed && s.pressed]}
            onPress={() => navigation.navigate('LogMasuk')}
          >
            <Text style={s.primaryText}>Mulakan dengan Moodify</Text>
          </Pressable>

          
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  hero: {
    height: 210,
    borderRadius: 24,
    backgroundColor: '#EAF0E4',
    overflow: 'hidden',
  },
  sun: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#F7E7C6',
    right: 34,
    top: 18,
  },
  cloudOne: { position: 'absolute', left: 8, top: 25 },
  cloudTwo: { position: 'absolute', right: 8, top: 95 },
  person: {
    position: 'absolute',
    width: 110,
    height: 150,
    left: '38%',
    bottom: 20,
  },
  hair: {
    position: 'absolute',
    width: 48,
    height: 58,
    borderRadius: 24,
    backgroundColor: '#5A4438',
    left: 31,
    top: 0,
  },
  face: {
    position: 'absolute',
    width: 38,
    height: 44,
    borderRadius: 19,
    backgroundColor: '#CBA180',
    left: 36,
    top: 18,
  },
  eyeLeft: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#3D3029', left: 9, top: 20 },
  eyeRight: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#3D3029', right: 9, top: 20 },
  body: {
    position: 'absolute',
    width: 78,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#C9B6E8',
    left: 16,
    top: 58,
  },
  legLeft: { position: 'absolute', width: 30, height: 42, borderRadius: 15, backgroundColor: '#A985C9', left: 27, bottom: 0, transform: [{ rotate: '-18deg' }] },
  legRight: { position: 'absolute', width: 30, height: 42, borderRadius: 15, backgroundColor: '#A985C9', right: 27, bottom: 0, transform: [{ rotate: '18deg' }] },
  mat: { position: 'absolute', width: 210, height: 18, borderRadius: 9, backgroundColor: '#DCC9A7', bottom: 12, left: '16%' },
  plant: { position: 'absolute', right: 36, bottom: 18, alignItems: 'center' },
  pot: { width: 28, height: 24, borderRadius: 6, backgroundColor: '#D9C4A5', marginTop: -2 },
  content: { flex: 1, paddingTop: 16, justifyContent: 'flex-start' },
  kicker: { color: C.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  title: { fontSize: 31, lineHeight: 37, fontWeight: '800', color: C.text },
  description: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 7, maxWidth: 320 },
  steps: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 14 },
  step: { flex: 1, alignItems: 'center', gap: 5 },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { color: C.text, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  primaryButton: { backgroundColor: C.primary, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.995 }] },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  dot: { color: C.muted, fontSize: 10 },
});
