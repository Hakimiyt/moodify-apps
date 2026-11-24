import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { getSession } from './auth';

const KEY = 'moodify:jurnal:pin';

async function getKey() {
  const session = await getSession();
  if (!session?.id) {
    throw new Error('NO_AUTH_SESSION');
  }
  return `${KEY}:${session.id}`;
}

async function hashPin(pin, salt) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export async function getJournalLockEnabled() {
  const record = await AsyncStorage.getItem(await getKey());
  return Boolean(record);
}

export async function saveJournalPin(pin) {
  const salt = Crypto.randomUUID();
  const record = {
    salt,
    hash: await hashPin(pin, salt),
  };
  await AsyncStorage.setItem(await getKey(), JSON.stringify(record));
}

export async function verifyJournalPin(pin) {
  const raw = await AsyncStorage.getItem(await getKey());
  if (!raw) return false;

  const record = JSON.parse(raw);
  return (await hashPin(pin, record.salt)) === record.hash;
}

export async function removeJournalPin() {
  await AsyncStorage.removeItem(await getKey());
}
