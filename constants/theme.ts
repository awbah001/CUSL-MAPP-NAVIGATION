export const theme = {
  background: '#F6F4EF',
  card: '#FFFFFF',
  text: '#17211C',
  muted: '#66716B',
  accent: '#146B4F',
  accentSoft: '#E6F3ED',
  ink: '#17211C',
  border: '#E4DFD6',
  placeholder: '#ECE7DE',
  onAccent: '#FFFFFF',
  shadow: '#1A211D',
};

export const elevation = {
  shadowColor: theme.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};

const categoryTones: Record<string, { ink: string; wash: string }> = {
  Academic: { ink: '#146B4F', wash: '#E6F3ED' },
  Administration: { ink: '#2E4A6E', wash: '#E8EEF6' },
  Food: { ink: '#9A4E24', wash: '#F8EDE6' },
  Health: { ink: '#1F6774', wash: '#E6F3F5' },
  Transport: { ink: '#5A4578', wash: '#F0EAF6' },
  Facilities: { ink: '#6A5632', wash: '#F4EFE4' },
};

export function toneForCategory(name: string) {
  return categoryTones[name] ?? { ink: theme.accent, wash: theme.accentSoft };
}
