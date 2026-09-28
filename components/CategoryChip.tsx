import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';

export type CategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={selected ? `${label}, selected` : label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        pressed && styles.chipPressed,
      ]}>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: theme.card,
  },
  chipSelected: {
    backgroundColor: theme.ink,
  },
  chipPressed: {
    opacity: 0.82,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  labelIdle: {
    color: theme.text,
    fontWeight: '600',
  },
  labelSelected: {
    color: theme.onAccent,
    fontWeight: '700',
  },
});
