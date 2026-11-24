import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { C, iconEmosi } from '../lib/theme';
import { formatTarikh, getRekod, padamRekod } from '../lib/storage';
import { getJournalLockEnabled, verifyJournalPin } from '../lib/journalLock';

const LABEL_HARI = ['A', 'I', 'S', 'R', 'K', 'J', 'S'];

export default function Jurnal({ navigation }) {
  const [rekod, setRekod] = useState([]);
  const [mingguDipilih, setMingguDipilih] = useState(0);
  const [pinDiperlukan, setPinDiperlukan] = useState(false);
  const [pinDimuat, setPinDimuat] = useState(false);
  const [pinDibuka, setPinDibuka] = useState(false);
  const [pin, setPin] = useState('');
  const [sedangSemak, setSedangSemak] = useState(false);
  const [ralatKunci, setRalatKunci] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let masihAktif = true;
      getJournalLockEnabled()
        .then(async (aktif) => {
          if (!masihAktif) return;
          setPinDiperlukan(aktif);
          setPinDibuka(!aktif);
          setPin('');
          setRalatKunci(false);

          if (aktif) {
            setRekod([]);
          } else {
            setRekod(await getRekod());
          }
          setPinDimuat(true);
        })
        .catch((error) => {
          console.error('[Moodify] gagal menyemak kunci jurnal:', error);
          if (masihAktif) {
            setPinDiperlukan(true);
            setPinDibuka(false);
            setRalatKunci(true);
            setPinDimuat(true);
          }
        });

      return () => {
        masihAktif = false;
        setPinDibuka(false);
        setPin('');
        setRekod([]);
      };
    }, [])
  );

  const hariMinggu = dapatkanHariMinggu(mingguDipilih);
  const mulaMinggu = hariMinggu[0];
  const hujungMinggu = new Date(hariMinggu[6]);
  hujungMinggu.setDate(hujungMinggu.getDate() + 1);
  const rekodMinggu = rekod.filter((item) => {
    const tarikh = new Date(item.tarikh);
    return tarikh >= mulaMinggu && tarikh < hujungMinggu;
  });

  const padam = async (id) => {
    await padamRekod(id);
    setRekod(await getRekod());
  };

  const bukaJurnal = async () => {
    if (pin.length !== 6) {
      Alert.alert('PIN tidak lengkap', 'Masukkan PIN 6 angka anda.');
      return;
    }

    try {
      setSedangSemak(true);
      const betul = await verifyJournalPin(pin);
      if (!betul) {
        Alert.alert('PIN tidak betul', 'Cuba masukkan PIN sekali lagi.');
        return;
      }
      setRekod(await getRekod());
      setPinDibuka(true);
      setPin('');
    } catch (error) {
      console.error('[Moodify] gagal membuka jurnal:', error);
      Alert.alert('Ralat', 'Jurnal tidak dapat dibuka.');
    } finally {
      setSedangSemak(false);
    }
  };

  const tajukMinggu = `${mulaMinggu.getDate()} ${bulanRingkas(mulaMinggu)} – ${hariMinggu[6].getDate()} ${bulanRingkas(hariMinggu[6])} ${hariMinggu[6].getFullYear()}`;

  const kepala = (
    <View style={s.kepala}>
      <Text style={s.kicker}>JURNAL PERIBADI</Text>
      <Text style={s.tajuk}>Cerita minggu anda</Text>
      <Text style={s.penerangan}>Kenali corak perasaan tanpa menilai diri.</Text>

      <View style={s.kalendar}>
        <View style={s.pilihMinggu}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Minggu sebelumnya"
            onPress={() => setMingguDipilih((nilai) => nilai - 1)}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={18} color={C.primary} />
          </Pressable>
          <Text style={s.tajukKalendar}>{tajukMinggu}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Minggu seterusnya"
            onPress={() => setMingguDipilih((nilai) => Math.min(nilai + 1, 0))}
            hitSlop={8}
          >
            <Ionicons name="chevron-forward" size={18} color={mingguDipilih === 0 ? C.border : C.primary} />
          </Pressable>
        </View>

        <View style={s.senaraiHari}>
          {hariMinggu.map((hari) => {
            const adaRekod = rekod.some(
              (item) => new Date(item.tarikh).toDateString() === hari.toDateString()
            );
            const hariIni = hari.toDateString() === new Date().toDateString();
            return (
              <View key={hari.toISOString()} style={s.hari}>
                <Text style={s.labelHari}>{LABEL_HARI[hari.getDay()]}</Text>
                <View style={[s.ikonHari, hariIni && s.ikonHariIni, adaRekod && s.ikonHariAdaRekod]}>
                  <Ionicons
                    name={adaRekod ? iconEmosi(emosiPadaHari(rekod, hari).emosi) : 'remove-outline'}
                    size={15}
                    color={adaRekod ? C.primary : C.muted}
                  />
                </View>
                <Text style={[s.nomborHari, hariIni && s.nomborHariIni]}>{hari.getDate()}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={s.barisRekod}>
        <Text style={s.tajukSeksyen}>Rekod anda</Text>
        <Text style={s.pautan}>{rekodMinggu.length} rekod minggu ini</Text>
      </View>
    </View>
  );

  if (!pinDimuat) {
    return (
      <SafeAreaView style={[s.safe, s.tengah]}>
        <ActivityIndicator color={C.primary} />
      </SafeAreaView>
    );
  }

  if (pinDiperlukan && !pinDibuka) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={[s.kandunganKunci, s.tengah]}>
          <View style={s.ikonKunci}>
            <Ionicons name="lock-closed-outline" size={25} color={C.primary} />
          </View>
          <Text style={s.tajukKunci}>Jurnal anda dikunci</Text>
          <Text style={s.peneranganKunci}>
            {ralatKunci
              ? 'Tetapan kunci tidak dapat dibaca. Cuba buka semula Jurnal.'
              : 'Masukkan PIN 6 angka untuk melihat rekod peribadi anda.'}
          </Text>
          {!ralatKunci && (
            <>
              <TextInput
                style={s.inputPin}
                value={pin}
                onChangeText={setPin}
                placeholder="PIN 6 angka"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
              />
              <Pressable style={s.butangBuka} onPress={bukaJurnal} disabled={sedangSemak}>
                <Text style={s.teksButangBuka}>{sedangSemak ? 'Menyemak...' : 'Buka jurnal'}</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={rekodMinggu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.senarai}
        ListHeaderComponent={kepala}
        ListEmptyComponent={
          <Text style={s.kosong}>Belum ada rekod minggu ini. Catat perasaan anda bila-bila masa.</Text>
        }
        renderItem={({ item, index }) => (
          <View style={[s.kadRekod, index === 0 && s.kadRekodUtama]}>
            <View style={s.barisKad}>
              <View style={s.emosiIkon}>
                <Ionicons name={iconEmosi(item.emosi)} size={18} color={C.primary} />
              </View>
              <View style={s.teksRekod}>
                <Text style={s.emosi}>{item.emosi}</Text>
                <Text style={s.tarikhRekod}>{formatTarikh(item.tarikh)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Padam rekod"
                onPress={() => padam(item.id)}
                hitSlop={10}
              >
                <Ionicons name="trash-outline" size={17} color={C.muted} />
              </Pressable>
            </View>
            <View style={s.butiran}>
              <Text style={s.chipButiran}>Stres {item.stres}/5</Text>
              <Text style={s.chipButiran}>Tenaga {item.tenaga}/5</Text>
              <Text style={s.chipButiran}>{item.faktor}</Text>
            </View>
            {!!item.catatan && <Text style={s.catatan}>{item.catatan}</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function dapatkanHariMinggu(offset) {
  const hariIni = new Date();
  const hariDalamMinggu = (hariIni.getDay() + 6) % 7;
  const isnin = new Date(hariIni);
  isnin.setDate(hariIni.getDate() - hariDalamMinggu + offset * 7);
  isnin.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const hari = new Date(isnin);
    hari.setDate(isnin.getDate() + index);
    return hari;
  });
}

function bulanRingkas(tarikh) {
  return tarikh.toLocaleDateString('ms-MY', { month: 'short' });
}

function emosiPadaHari(rekod, hari) {
  return rekod.find((item) => new Date(item.tarikh).toDateString() === hari.toDateString());
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  tengah: { alignItems: 'center', justifyContent: 'center' },
  kandunganKunci: { flex: 1, width: '100%', padding: 24 },
  ikonKunci: { width: 54, height: 54, borderRadius: 27, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  tajukKunci: { color: C.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  peneranganKunci: { color: C.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7, marginBottom: 18 },
  inputPin: { width: '100%', height: 48, borderRadius: 11, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, paddingHorizontal: 14, color: C.text, textAlign: 'center', letterSpacing: 7 },
  butangBuka: { width: '100%', minHeight: 46, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 11 },
  teksButangBuka: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  senarai: { padding: 18, paddingBottom: 24, gap: 10 },
  kepala: { gap: 8, marginBottom: 2 },
  kicker: { color: C.primary, fontSize: 9, fontWeight: '700' },
  tajuk: { color: C.text, fontSize: 24, fontWeight: '700' },
  penerangan: { color: C.muted, fontSize: 12 },
  kalendar: { backgroundColor: C.card, borderRadius: 16, padding: 12, marginTop: 5, gap: 12 },
  pilihMinggu: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tajukKalendar: { color: C.text, fontSize: 10, fontWeight: '600' },
  senaraiHari: { flexDirection: 'row', justifyContent: 'space-between' },
  hari: { alignItems: 'center', gap: 4 },
  labelHari: { color: C.muted, fontSize: 8 },
  ikonHari: { width: 27, height: 27, borderRadius: 14, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  ikonHariIni: { borderWidth: 1, borderColor: C.primary },
  ikonHariAdaRekod: { backgroundColor: C.primarySoft },
  nomborHari: { color: C.text, fontSize: 9 },
  nomborHariIni: { color: C.primary, fontWeight: '700' },
  barisRekod: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  tajukSeksyen: { color: C.text, fontSize: 15, fontWeight: '700' },
  pautan: { color: C.primary, fontSize: 9 },
  kosong: { color: C.muted, fontSize: 12, lineHeight: 18, paddingVertical: 12 },
  kadRekod: { backgroundColor: C.card, borderRadius: 16, padding: 13, gap: 10 },
  kadRekodUtama: { padding: 15 },
  barisKad: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  emosiIkon: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  teksRekod: { flex: 1, gap: 3 },
  emosi: { color: C.text, fontSize: 13, fontWeight: '600' },
  tarikhRekod: { color: C.muted, fontSize: 9 },
  butiran: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chipButiran: { color: C.text, backgroundColor: C.bg, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, fontSize: 9 },
  catatan: { color: C.muted, fontSize: 11, lineHeight: 16 },
});
