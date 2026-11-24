export const C = {
  bg: '#FAF8F3',
  card: '#FFFFFF',
  primary: '#7459B0',
  primarySoft: '#EAE4F6',
  sage: '#DDE8DC',
  text: '#2B2733',
  muted: '#7A7585',
  border: '#ECE8E0',
};

export const EMOSI = [
  { key: 'Gembira', icon: 'happy-outline' },
  { key: 'Tenang', icon: 'leaf-outline' },
  { key: 'Biasa', icon: 'remove-circle-outline' },
  { key: 'Sedih', icon: 'sad-outline' },
  { key: 'Tertekan', icon: 'cloud-outline' },
];

export const FAKTOR = ['Tugasan', 'Tidur', 'Sosial', 'Lain-lain'];

export const iconEmosi = (k) =>
  EMOSI.find((e) => e.key === k)?.icon ?? 'help-outline';
