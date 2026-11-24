import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';
import { padamSemua } from '../lib/storage';
import { AuthContext } from '../lib/auth-context';
import { logout, updateProfile } from '../lib/auth';
import {
  getJournalLockEnabled,
  removeJournalPin,
  saveJournalPin,
  verifyJournalPin,
} from '../lib/journalLock';

export default function Profil() {
  const { session, setSession } = useContext(AuthContext);
  const [peringatan, setPeringatan] = useState(true);
  const [kunciJurnal, setKunciJurnal] = useState(false);
  const [paparEdit, setPaparEdit] = useState(false);
  const [nama, setNama] = useState('');
  const [emel, setEmel] = useState('');
  const [paparPin, setPaparPin] = useState(false);
  const [caraPin, setCaraPin] = useState('cipta');
  const [pin, setPin] = useState('');
  const [sahkanPin, setSahkanPin] = useState('');
  const [sedangSimpan, setSedangSimpan] = useState(false);

  useEffect(() => {
    let masihAktif = true;
    getJournalLockEnabled()
      .then((aktif) => {
        if (masihAktif) setKunciJurnal(aktif);
      })
      .catch((error) => {
        console.error('[Moodify] gagal membaca tetapan jurnal:', error);
        Alert.alert('Ralat', 'Tetapan kunci jurnal tidak dapat dibaca.');
      });

    return () => {
      masihAktif = false;
    };
  }, []);

  const bukaEdit = () => {
    setNama(session?.name || '');
    setEmel(session?.email || '');
    setPaparEdit(true);
  };

  const simpanProfil = async () => {
    if (!nama.trim() || !emel.trim()) {
      Alert.alert('Maklumat diperlukan', 'Masukkan nama dan e-mel anda.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emel.trim())) {
      Alert.alert('E-mel tidak sah', 'Semak semula alamat e-mel anda.');
      return;
    }

    try {
      setSedangSimpan(true);
      const sesiBaru = await updateProfile({ name: nama, email: emel });
      setSession(sesiBaru);
      setPaparEdit(false);
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS') {
        Alert.alert('E-mel sudah digunakan', 'Gunakan alamat e-mel yang lain.');
      } else {
        console.error('[Moodify] gagal mengemas kini profil:', error);
        Alert.alert('Ralat', 'Profil tidak dapat dikemas kini.');
      }
    } finally {
      setSedangSimpan(false);
    }
  };

  const tukarKunciJurnal = (aktif) => {
    setCaraPin(aktif ? 'cipta' : 'buang');
    setPin('');
    setSahkanPin('');
    setPaparPin(true);
  };

  const simpanTetapanPin = async () => {
    if (!/^\d{6}$/.test(pin)) {
      Alert.alert('PIN tidak sah', 'Masukkan PIN yang mengandungi 6 angka.');
      return;
    }

    try {
      setSedangSimpan(true);
      if (caraPin === 'cipta') {
        if (pin !== sahkanPin) {
          Alert.alert('PIN tidak sepadan', 'Masukkan PIN yang sama pada kedua-dua ruangan.');
          return;
        }
        await saveJournalPin(pin);
        setKunciJurnal(true);
      } else {
        const betul = await verifyJournalPin(pin);
        if (!betul) {
          Alert.alert('PIN tidak betul', 'Cuba masukkan PIN jurnal sekali lagi.');
          return;
        }
        await removeJournalPin();
        setKunciJurnal(false);
      }
      setPaparPin(false);
      setPin('');
      setSahkanPin('');
    } catch (error) {
      console.error('[Moodify] gagal menyimpan tetapan PIN:', error);
      Alert.alert('Ralat', 'Tetapan kunci jurnal tidak dapat disimpan.');
    } finally {
      setSedangSimpan(false);
    }
  };

  const padamRekod = () => {
    Alert.alert('Padam semua rekod?', 'Tindakan ini tidak boleh dibatalkan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Padam',
        style: 'destructive',
        onPress: async () => {
          try {
            await padamSemua();
          } catch (error) {
            console.error('[Moodify] gagal memadam rekod:', error);
            Alert.alert('Ralat', 'Rekod tidak dapat dipadam.');
          }
        },
      },
    ]);
  };

  const logKeluar = () => {
    Alert.alert('Log keluar?', 'Anda perlu log masuk semula untuk melihat akaun ini.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Log keluar',
        onPress: async () => {
          try {
            await logout();
            setSession(null);
          } catch (error) {
            console.error('[Moodify] gagal log keluar:', error);
            Alert.alert('Ralat', 'Tidak dapat log keluar. Cuba lagi sebentar.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.kandungan}>
        <Text style={s.tajuk}>Profil & privasi</Text>
        <Text style={s.penerangan}>Pilihan kecil, di bawah kawalan anda.</Text>

        <View style={s.profil}>
          <View style={s.avatar}>
            <Text style={s.hurufAvatar}>{session?.name?.charAt(0).toUpperCase() || 'A'}</Text>
          </View>
          <View style={s.teksProfil}>
            <Text style={s.nama}>{session?.name}</Text>
            <Text style={s.emel}>{session?.email}</Text>
          </View>
          <Pressable onPress={bukaEdit} accessibilityLabel="Edit profil" hitSlop={10}>
            <Ionicons name="pencil-outline" size={18} color={C.primary} />
          </Pressable>
        </View>

        <Text style={s.tajukSeksyen}>Ruang peribadi anda</Text>
        <View style={s.kadTetapan}>
          <View style={s.barisTetapan}>
            <Ionicons name="lock-closed-outline" size={19} color={C.primary} />
            <View style={s.teksTetapan}>
              <Text style={s.label}>Kunci jurnal</Text>
              <Text style={s.keterangan}>Minta kod akses apabila membuka jurnal.</Text>
            </View>
            <Switch
              value={kunciJurnal}
              onValueChange={tukarKunciJurnal}
              trackColor={{ true: C.primary }}
            />
          </View>

          <View style={s.garis} />

          <View style={s.barisTetapan}>
            <Ionicons name="notifications-outline" size={19} color={C.primary} />
            <View style={s.teksTetapan}>
              <Text style={s.label}>Peringatan harian</Text>
              <Text style={s.keterangan}>8:30 malam · Masa untuk semak diri</Text>
            </View>
            <Switch
              value={peringatan}
              onValueChange={setPeringatan}
              trackColor={{ true: C.primary }}
            />
          </View>
        </View>

        <Pressable style={s.kadPadam} onPress={padamRekod}>
          <Ionicons name="trash-outline" size={19} color={C.primary} />
          <View style={s.teksPadam}>
            <Text style={s.label}>Padam semua rekod</Text>
            <Text style={s.keterangan}>Pengesahan diperlukan sebelum pemadaman.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.primary} />
        </Pressable>

        <View style={s.kadBantuan}>
          <View style={s.barisBantuan}>
            <Ionicons name="hand-left-outline" size={19} color={C.primary} />
            <Text style={s.tajukBantuan}>Anda tidak perlu bersendirian</Text>
          </View>
          <Text style={s.teksBantuan}>
            Perlukan seseorang untuk mendengar? Hubungi unit kaunseling kampus atau Talian HEAL 15555.
          </Text>
          <Text style={s.teksKecemasan}>Kecemasan atau bahaya segera: hubungi 999.</Text>
        </View>

        <Text style={s.penafian}>
          Moodify menyokong refleksi diri, bukan diagnosis atau pengganti bantuan profesional.
        </Text>

        <Pressable style={s.butangKeluar} onPress={logKeluar}>
          <Ionicons name="log-out-outline" size={18} color={C.primary} />
          <Text style={s.teksKeluar}>Log keluar</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={paparEdit} transparent animationType="fade" onRequestClose={() => setPaparEdit(false)}>
        <View style={s.lapisanModal}>
          <View style={s.modal}>
            <Text style={s.tajukModal}>Edit profil</Text>
            <Text style={s.labelInput}>Nama</Text>
            <TextInput style={s.input} value={nama} onChangeText={setNama} placeholder="Nama anda" />
            <Text style={s.labelInput}>E-mel</Text>
            <TextInput
              style={s.input}
              value={emel}
              onChangeText={setEmel}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="nama@email.com"
            />
            <Pressable style={s.butangModal} onPress={simpanProfil} disabled={sedangSimpan}>
              <Text style={s.teksButangModal}>{sedangSimpan ? 'Menyimpan...' : 'Simpan'}</Text>
            </Pressable>
            <Pressable style={s.butangBatal} onPress={() => setPaparEdit(false)}>
              <Text style={s.teksBatal}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={paparPin} transparent animationType="fade" onRequestClose={() => setPaparPin(false)}>
        <View style={s.lapisanModal}>
          <View style={s.modal}>
            <Text style={s.tajukModal}>{caraPin === 'cipta' ? 'Tetapkan PIN jurnal' : 'Matikan kunci jurnal'}</Text>
            <Text style={s.keteranganModal}>
              {caraPin === 'cipta'
                ? 'Gunakan PIN 6 angka untuk membuka jurnal.'
                : 'Masukkan PIN semasa untuk mematikan kunci.'}
            </Text>
            <TextInput
              style={s.input}
              value={pin}
              onChangeText={setPin}
              placeholder="PIN 6 angka"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
            />
            {caraPin === 'cipta' && (
              <TextInput
                style={s.input}
                value={sahkanPin}
                onChangeText={setSahkanPin}
                placeholder="Masukkan semula PIN"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
              />
            )}
            <Pressable style={s.butangModal} onPress={simpanTetapanPin} disabled={sedangSimpan}>
              <Text style={s.teksButangModal}>{sedangSimpan ? 'Menyimpan...' : 'Simpan'}</Text>
            </Pressable>
            <Pressable style={s.butangBatal} onPress={() => setPaparPin(false)}>
              <Text style={s.teksBatal}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kandungan: { padding: 18, paddingBottom: 24, gap: 12 },
  tajuk: { color: C.text, fontSize: 24, fontWeight: '700' },
  penerangan: { color: C.muted, fontSize: 12, marginTop: -7 },
  profil: { flexDirection: 'row', alignItems: 'center', gap: 11, marginVertical: 3 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  hurufAvatar: { color: C.text, fontSize: 18, fontWeight: '600' },
  teksProfil: { flex: 1, gap: 3 },
  nama: { color: C.text, fontSize: 13, fontWeight: '700' },
  emel: { color: C.muted, fontSize: 9 },
  tajukSeksyen: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 1 },
  kadTetapan: { backgroundColor: C.card, borderRadius: 17, paddingHorizontal: 13 },
  barisTetapan: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10 },
  teksTetapan: { flex: 1, gap: 3 },
  label: { color: C.text, fontSize: 11, fontWeight: '600' },
  keterangan: { color: C.muted, fontSize: 9 },
  garis: { height: 1, backgroundColor: C.border, marginLeft: 29 },
  kadPadam: { minHeight: 60, backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  teksPadam: { flex: 1, gap: 4 },
  kadBantuan: { backgroundColor: C.sage, borderRadius: 17, padding: 14, gap: 8 },
  barisBantuan: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tajukBantuan: { color: C.text, fontSize: 14, fontWeight: '500' },
  teksBantuan: { color: C.text, fontSize: 10, lineHeight: 15 },
  teksKecemasan: { color: C.text, fontSize: 9, fontWeight: '600' },
  penafian: { color: C.muted, fontSize: 9, lineHeight: 13, textAlign: 'center', marginTop: 1 },
  butangKeluar: { minHeight: 43, borderRadius: 13, backgroundColor: C.primarySoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  teksKeluar: { color: C.primary, fontSize: 11, fontWeight: '700' },
  lapisanModal: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', padding: 22 },
  modal: { backgroundColor: C.bg, borderRadius: 18, padding: 18, gap: 10 },
  tajukModal: { color: C.text, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  keteranganModal: { color: C.muted, fontSize: 11, lineHeight: 16 },
  labelInput: { color: C.text, fontSize: 11, fontWeight: '600', marginBottom: -6 },
  input: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, paddingHorizontal: 12, color: C.text, fontSize: 12 },
  butangModal: { minHeight: 44, borderRadius: 11, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  teksButangModal: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  butangBatal: { alignItems: 'center', padding: 6 },
  teksBatal: { color: C.muted, fontSize: 11 },
});
