# Moodify

A mood tracking and mental wellbeing app for students, built with **React Native (Expo)** and **JavaScript**. All data is stored **locally** on the device using AsyncStorage (no server).

> Moodify supports self-reflection. It is not a diagnosis tool or a replacement for professional help.

## Objectives

- Let users **add** daily mood records (emotion, stress, energy, factor, note).
- **Display** records in a journal and a latest-entry summary.
- **Store** data locally with AsyncStorage, separated per user account.
- Provide short wellbeing activities (guided breathing).
- Prepare the app for a **release build** (APK).

## Features and Screens

| Screen | Function |
|---|---|
| Welcome (SelamatDatang) | Intro screen with links to register and log in |
| Register (Daftar) | Create a local account (name, email, password) |
| Log In (LogMasuk) | Sign in with a locally stored account |
| Home (Utama) | Greeting, record mood button, latest entry summary |
| Record Mood (Rekod) | Choose emotion, stress (1-5), energy (1-5), factor, note |
| Record Saved (Disimpan) | Confirmation after saving |
| Journal (Jurnal) | List of records, delete a record |
| Activities (Aktiviti) | List of short wellbeing activities |
| Breathing (Pernafasan) | Guided breathing introduction |
| Breathing Session (SesiPernafasan) | Timed breathing session |
| Profile (Profil) | Edit profile, journal PIN lock, daily reminder, delete all records, log out |

## Tech Stack

- React Native with Expo
- React Navigation (native stack and bottom tabs)
- @react-native-async-storage/async-storage
- expo-crypto (hashing for passwords and PIN)
- @expo/vector-icons

## Project Structure

```
moodify-apps/
  App.js                 # navigation, auth session handling
  index.js               # entry point
  app.json               # Expo config (name, icons, package ID)
  screens/               # 11 app screens
  lib/
    storage.js           # mood records (read, add, delete)
    auth.js              # register, login, session, profile update
    auth-context.js      # session context
    journalLock.js       # journal PIN lock
    theme.js             # colors and shared lists
  assets/                # app icons
```

## Local Data Storage

Data is saved with AsyncStorage using these keys:

| Key | Content |
|---|---|
| `moodify:users` | Registered accounts (password stored as a salted SHA-256 hash) |
| `moodify:session` | Currently logged-in user |
| `moodify:records:<userId>` | Mood records for that user (JSON array) |
| `moodify:jurnal:pin:<userId>` | Journal PIN (salted hash) |

Example mood record:

```json
{
  "id": "1732431000000",
  "emosi": "Tertekan",
  "stres": 4,
  "tenaga": 2,
  "faktor": "Tugasan",
  "catatan": "Banyak tugasan minggu ini.",
  "tarikh": "2026-11-24T09:41:00.000Z"
}
```

Accounts are stored on the device only. They demonstrate local persistence and are not a replacement for a real backend login.

## Getting Started

```
git clone https://github.com/Hakimiyt/moodify-apps.git
cd moodify-apps
npm install --legacy-peer-deps
npx expo start -c
```

Scan the QR code with **Expo Go**, or press `a` to open an Android emulator.

## Debugging and Testing

- Errors are logged with `console.error` and shown to the user with `Alert`.
- Project health check: `npx expo-doctor`.
- Manual test checklist: register, log in, add a record, view it in the journal, close and reopen the app to confirm data persists, delete a record, set and verify the journal PIN, log out and log in again.

<!-- Add: terminal log screenshots and one bug you found, with how you fixed it. -->

## Release Build

Using EAS:

```
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The result is an APK that can be installed on an Android device.

## Marketplace Metadata

- **Name:** Moodify
- **Category:** Health & Fitness
- **Tagline:** A small space for yourself: log your mood, understand your feelings.
- **Package ID:** `com.moodify.app`
- **Icon:** `assets/icon.png` (1024x1024)
