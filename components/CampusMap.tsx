import { useRouter } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

import { CAMPUS_INITIAL_REGION, OSM_TILE_URL } from '@/constants/campus';
import { elevation, theme } from '@/constants/theme';
import type { LivePlace } from '@/data/live';
import type { UserCoordinates } from '@/hooks/useUserLocation';

type CampusMapProps = {
  places: LivePlace[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  userLocation: UserCoordinates | null;
};

export function CampusMap({ places, loading, error, onRetry, userLocation }: CampusMapProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={CAMPUS_INITIAL_REGION}
        mapPadding={{ top: 88, right: 12, bottom: 36, left: 12 }}
        showsUserLocation={userLocation != null}
        showsMyLocationButton={false}
        toolbarEnabled={false}>
        <UrlTile
          urlTemplate={OSM_TILE_URL}
          maximumZ={19}
          maximumNativeZ={19}
          flipY={false}
          shouldReplaceMapContent
          tileSize={256}
          zIndex={-1}
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.categoryLabel}
            pinColor={theme.accent}
            onPress={() =>
              router.push({
                pathname: '/place/[id]',
                params: { id: place.id },
              })
            }
          />
        ))}
      </MapView>
      {loading || error ? (
        <View style={styles.status}>
          {loading ? <ActivityIndicator color={theme.accent} /> : null}
          <Text style={styles.statusText}>
            {error ?? 'Loading campus places…'}
          </Text>
          {error ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try loading places again"
              onPress={onRetry}
              style={styles.retry}>
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <View pointerEvents="none" style={styles.banner}>
        <View style={styles.dot} />
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerText}>Tap a marker to view a place.</Text>
          <Text style={styles.bannerNote}>Pins are approximate and awaiting field verification.</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="OpenStreetMap copyright"
        onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}
        style={styles.attribution}>
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  map: {
    flex: 1,
  },
  status: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 56,
    padding: 16,
    borderRadius: 18,
    backgroundColor: theme.card,
    gap: 10,
    alignItems: 'flex-start',
    ...elevation,
  },
  statusText: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 21,
  },
  retry: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: theme.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryLabel: {
    color: theme.onAccent,
    fontSize: 15,
    fontWeight: '700',
  },
  banner: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: theme.card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    ...elevation,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: theme.accent,
  },
  bannerCopy: {
    flex: 1,
    gap: 2,
  },
  bannerText: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  bannerNote: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  attribution: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  attributionText: {
    color: theme.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  },
});
