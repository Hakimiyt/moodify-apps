import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, iconEmosi } from '../lib/theme';
import { getRekod, formatTarikh } from '../lib/storage';

export default function Disimpan({ navigation }) {
  const [r, setR] = useState(null);

  useEffect(() => {
    getRekod().then((d) => setR(d[0] ?? null));
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.wrap}>
        <View style={s.tick}>
          <Ionicons name="checkmark" size={36} color={C.primary} />
        </View>
        <Text style={s.title}>Rekod disimpan.</Text>
        <Text style={s.muted}>Terima kasih kerana mendengar diri sendiri.</Text>

        {r && (
          <View style={s.card}>
            <Text style={s.muted}>{formatTarikh(r.tarikh)}</Text>
            <View style={s.line}>
              <Ionicons name={iconEmosi(r.emosi)} size={22} color={C.primary} />
              <Text style={s.emosi}>{r.emosi}</Text>
            </View>
            <Text style={s.muted}>Stres {r.stres}/5 · Tenaga {r.tenaga}/5 · {r.faktor}</Text>
            {!!r.catatan && <Text style={s.catatan}>"{r.catatan}"</Text>}
          </View>
        )}

        <Pressable style={s.btn} onPress={() => navigation.navigate('Tabs', { screen: 'Jurnal' })}>
          <Text style={s.btnText}>Lihat jurnal saya</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Utama' })}>
          <Text style={s.link}>Kembali ke Utama</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  wrap: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12 },
  tick: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: C.text },
  muted: { color: C.muted, fontSize: 13, textAlign: 'center' },
  card: { alignSelf: 'stretch', backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: C.border },
  line: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emosi: { fontSize: 20, fontWeight: '700', color: C.text },
  catatan: { color: C.text, fontStyle: 'italic' },
  btn: { alignSelf: 'stretch', backgroundColor: C.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
  link: { color: C.primary, fontWeight: '600', marginTop: 4 },
});
