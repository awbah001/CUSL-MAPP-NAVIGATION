import { Pressable, StyleSheet, Text, View } from 'react-native';

import { elevation, theme, toneForCategory } from '@/constants/theme';

export type PlaceCardProps = {
  name: string;
  categoryName: string;
  building: string | null;
  description: string;
  distanceLabel?: string | null;
  onPress: () => void;
};

export function PlaceCard({
  name,
  categoryName,
  building,
  description,
  distanceLabel,
  onPress,
}: PlaceCardProps) {
  const tone = toneForCategory(categoryName);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${name}`}
      accessibilityHint="Opens the place details screen"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.top}>
        <View style={[styles.badge, { backgroundColor: tone.wash }]}>
          <Text style={[styles.badgeText, { color: tone.ink }]}>{categoryName}</Text>
        </View>
        <View style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no">
          <Text style={styles.chevronGlyph}>›</Text>
        </View>
      </View>
      <Text style={styles.name}>{name}</Text>
      {distanceLabel ? <Text style={styles.distance}>{distanceLabel} away</Text> : null}
      {building ? <Text style={styles.building}>{building}</Text> : null}
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: theme.card,
    gap: 8,
    ...elevation,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '78%',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accentSoft,
  },
  chevronGlyph: {
    color: theme.accent,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    marginTop: -2,
  },
  name: {
    color: theme.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  distance: {
    color: theme.accent,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  building: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 20,
  },
  description: {
    color: theme.muted,
    fontSize: 15,
    lineHeight: 21,
  },
});
