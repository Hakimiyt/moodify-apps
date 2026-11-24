import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const USERS_KEY = 'moodify:users';
const SESSION_KEY = 'moodify:session';

async function getUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function hashPassword(password, salt) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
}

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('EMAIL_EXISTS');
  }

  const salt = Crypto.randomUUID();
  const user = {
    id: Crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  const session = { id: user.id, name: user.name, email: user.email };

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const session = { id: user.id, name: user.name, email: user.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function updateProfile({ name, email }) {
  const session = await getSession();
  if (!session) {
    throw new Error('NO_AUTH_SESSION');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  if (users.some((user) => user.id !== session.id && user.email === normalizedEmail)) {
    throw new Error('EMAIL_EXISTS');
  }

  let userFound = false;
  const updatedUsers = users.map((user) => {
    if (user.id !== session.id) return user;
    userFound = true;
    return { ...user, name: name.trim(), email: normalizedEmail };
  });

  if (!userFound) {
    throw new Error('USER_NOT_FOUND');
  }

  const updatedSession = { ...session, name: name.trim(), email: normalizedEmail };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
