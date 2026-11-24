import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import UtamaScreen from './screens/UtamaScreen';
import JurnalScreen from './screens/JurnalScreen';
import ProfilScreen from './screens/ProfilScreen';
import AktivitiScreen from './screens/AktivitiScreen';
import PernafasanScreen from './screens/PernafasanScreen';
import SesiPernafasanScreen from './screens/SesiPernafasanScreen';
import RekodScreen from './screens/RekodScreen';
import DisimpanScreen from './screens/DisimpanScreen';
import SelamatDatangScreen from './screens/SelamatDatangScreen';
import LogMasukScreen from './screens/LogMasukScreen';
import DaftarScreen from './screens/DaftarScreen';
import { getSession } from './lib/auth';
import { AuthContext } from './lib/auth-context';
import { C } from './lib/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ikon(nama) {
  function TabIcon({ color, size }) {
    return <Ionicons name={nama} color={color} size={size} />;
  }
  return TabIcon;
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.border },
      }}
    >
      <Tab.Screen name="Utama" component={UtamaScreen} options={{ tabBarIcon: ikon('home-outline') }} />
      <Tab.Screen name="Jurnal" component={JurnalScreen} options={{ tabBarIcon: ikon('book-outline') }} />
      <Tab.Screen name="Aktiviti" component={AktivitiScreen} options={{ tabBarIcon: ikon('leaf-outline') }} />
      <Tab.Screen name="Profil" component={ProfilScreen} options={{ tabBarIcon: ikon('person-outline') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSession()
      .then((savedSession) => {
        if (active) setSession(savedSession);
      })
      .catch((error) => {
        console.error('[Moodify] gagal memuat sesi:', error);
        Alert.alert('Ralat storan', 'Sesi akaun tidak dapat dimuatkan. Cuba buka semula aplikasi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ session, setSession }}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={C.primary} />
          </View>
        ) : (
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {session ? (
                <>
                  <Stack.Screen name="Tabs" component={Tabs} />
                  <Stack.Screen name="Rekod" component={RekodScreen} />
                  <Stack.Screen name="Disimpan" component={DisimpanScreen} />
                  <Stack.Screen name="Pernafasan" component={PernafasanScreen} />
                  <Stack.Screen name="SesiPernafasan" component={SesiPernafasanScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="SelamatDatang" component={SelamatDatangScreen} />
                  <Stack.Screen name="LogMasuk" component={LogMasukScreen} />
                  <Stack.Screen name="Daftar" component={DaftarScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});