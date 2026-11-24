import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'moodify:records';
const SESSION_KEY = 'moodify:session';

async function getKey() {
  const rawSession = await AsyncStorage.getItem(SESSION_KEY);
  const session = rawSession ? JSON.parse(rawSession) : null;
  if (!session?.id) {
    throw new Error('NO_AUTH_SESSION');
  }

  const key = `${KEY}:${session.id}`;
  const savedRecords = await AsyncStorage.getItem(key);
  if (!savedRecords) {
    const legacyRecords = await AsyncStorage.getItem(KEY);
    if (legacyRecords) {
      await AsyncStorage.setItem(key, legacyRecords);
      await AsyncStorage.removeItem(KEY);
    }
  }
  return key;
}

export async function getRekod() {
  try {
    const key = await getKey();
    const raw = await AsyncStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    console.log('[Moodify] baca rekod:', data.length);
    return data;
  } catch (e) {
    console.log('[Moodify] ralat baca:', e);
    return [];
  }
}

export async function tambahRekod(r) {
  const semua = await getRekod();
  const key = await getKey();
  const baru = { ...r, id: Date.now().toString(), tarikh: new Date().toISOString() };
  await AsyncStorage.setItem(key, JSON.stringify([baru, ...semua]));
  console.log('[Moodify] rekod disimpan:', baru);
  return baru;
}

export async function padamRekod(id) {
  const semua = await getRekod();
  const key = await getKey();
  await AsyncStorage.setItem(key, JSON.stringify(semua.filter((x) => x.id !== id)));
}

export async function padamSemua() {
  const key = await getKey();
  await AsyncStorage.removeItem(key);
  console.log('[Moodify] semua rekod dipadam');
}

export const formatTarikh = (iso) =>
  new Date(iso).toLocaleString('ms-MY', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
