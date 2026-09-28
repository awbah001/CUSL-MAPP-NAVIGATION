import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme, toneForCategory } from '@/constants/theme';
import { fetchPlaceById, type LivePlace } from '@/data/live';
import { walkingDirectionsUrl } from '@/lib/directions';

function readId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function displayValue(value: string | null, fallback: string): string {
  if (value == null || value.trim() === '') {
    return fallback;
  }
  return value;
}

export default function PlaceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const placeId = readId(params.id);
  const [place, setPlace] = useState<LivePlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!placeId) {
        setPlace(null);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const next = await fetchPlaceById(placeId);
        if (active) {
          setPlace(next);
        }
      } catch (cause) {
        if (active) {
          setPlace(null);
          setError(cause instanceof Error ? cause.message : 'Could not load this place.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [placeId]);

  if (loading) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Place details' }} />
        <ActivityIndicator color={theme.accent} />
        <Text style={styles.missingText}>Loading this place…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Place details' }} />
        <View style={styles.missingCard}>
          <Text style={styles.missingText}>
            Could not load this place. Check your connection and try again.
          </Text>
          <Text style={styles.note}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Place not found' }} />
        <View style={styles.missingCard}>
          <Text style={styles.missingKicker}>Directory</Text>
          <Text style={styles.missingText}>
            Place not found. Return to the campus directory to select another location.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to campus directory"
            onPress={() => router.navigate('/places')}
            style={({ pressed }) => [styles.returnButton, pressed && styles.returnButtonPressed]}>
            <Text style={styles.returnLabel}>Return to campus directory</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const tone = toneForCategory(place.categoryLabel);
  const building = displayValue(place.building, 'Building not provided');
  const hours = displayValue(place.hours, 'Opening hours not provided');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: place.name }} />
      <View style={styles.photoFallback}>
        <Text style={styles.photoFallbackText}>No photo available</Text>
      </View>

      <View style={styles.sheet}>
        <View style={[styles.badge, { backgroundColor: tone.wash }]}>
          <Text style={[styles.badgeText, { color: tone.ink }]}>
            {`${place.categoryEmoji} ${place.categoryLabel}`.trim()}
          </Text>
        </View>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Navigate to ${place.name}`}
          onPress={() => {
            void Linking.openURL(walkingDirectionsUrl(place.latitude, place.longitude));
          }}
          style={({ pressed }) => [styles.navigate, pressed && styles.returnButtonPressed]}>
          <Text style={styles.returnLabel}>Navigate</Text>
        </Pressable>

        <View style={styles.panel}>
          <InfoRow label="Building" value={building} missing={place.building == null} />
          <View style={styles.divider} />
          <InfoRow label="Opening hours" value={hours} missing={place.hours == null} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelLabel}>Location</Text>
          <View style={styles.coords}>
            <InfoRow label="Latitude" value={String(place.latitude)} />
            <InfoRow label="Longitude" value={String(place.longitude)} />
          </View>
          <Text style={styles.note}>Coordinates are approximate and awaiting field verification.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value, missing = false }: { label: string; value: string; missing?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, missing && styles.rowMissing]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.background,
    paddingBottom: 28,
  },
  photo: {
    width: '100%',
    height: 240,
    backgroundColor: theme.placeholder,
  },
  photoFallback: {
    width: '100%',
    height: 180,
    backgroundColor: theme.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  photoFallbackText: {
    color: theme.muted,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },
  sheet: {
    marginTop: -24,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: theme.card,
    gap: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  name: {
    color: theme.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  description: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    borderRadius: 18,
    backgroundColor: theme.background,
    padding: 14,
    gap: 12,
  },
  panelLabel: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
  },
  coords: {
    flexDirection: 'row',
    gap: 16,
  },
  row: {
    flex: 1,
    gap: 3,
  },
  rowLabel: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  rowValue: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 22,
  },
  rowMissing: {
    color: theme.muted,
  },
  note: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  missing: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    padding: 24,
  },
  missingCard: {
    backgroundColor: theme.card,
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  missingKicker: {
    color: theme.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  missingText: {
    color: theme.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  },
  returnButton: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: theme.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  navigate: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  returnButtonPressed: {
    opacity: 0.86,
  },
  returnLabel: {
    color: theme.onAccent,
    fontSize: 16,
    fontWeight: '700',
  },
});
