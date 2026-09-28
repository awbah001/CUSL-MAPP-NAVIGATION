import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { createElement } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

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

/**
 * Browser preview. Phones use CampusMap.tsx. Both draw OpenStreetMap tiles and
 * the same place records.
 */
export function CampusMap({ places, loading, error, onRetry, userLocation }: CampusMapProps) {
  const router = useRouter();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; id?: string } | null;
      if (!data || data.type !== 'place' || typeof data.id !== 'string') {
        return;
      }
      if (!places.some((place) => place.id === data.id)) {
        return;
      }
      router.push({
        pathname: '/place/[id]',
        params: { id: data.id },
      });
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [places, router]);

  return (
    <View style={styles.container}>
      {createElement('iframe', {
        title: 'OpenStreetMap of Central University, Mile 91',
        srcDoc: osmMapDocument(places, userLocation),
        style: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderWidth: 0,
        },
      })}
      {loading || error ? (
        <View style={styles.status}>
          {loading ? <ActivityIndicator color={theme.accent} /> : null}
          <Text style={styles.statusText}>{error ?? 'Loading campus places…'}</Text>
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
    </View>
  );
}

function osmMapDocument(places: LivePlace[], userLocation: UserCoordinates | null) {
  const pins = places.map((place) => ({
    id: place.id,
    name: place.name,
    category: place.categoryLabel,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; height: 100%; background: #f6f4ef; }
    .leaflet-control-attribution { font-size: 11px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const places = ${JSON.stringify(pins)};
    const user = ${JSON.stringify(userLocation)};
    const map = L.map('map', { zoomControl: false }).setView(
      [${CAMPUS_INITIAL_REGION.latitude}, ${CAMPUS_INITIAL_REGION.longitude}],
      16
    );
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.tileLayer(${JSON.stringify(OSM_TILE_URL)}, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    places.forEach((place) => {
      L.marker([place.latitude, place.longitude])
        .addTo(map)
        .bindPopup('<strong>' + place.name + '</strong><br>' + place.category)
        .on('click', () => {
          parent.postMessage({ type: 'place', id: place.id }, '*');
        });
    });
    if (user) {
      L.circleMarker([user.latitude, user.longitude], {
        radius: 8,
        color: '#146B4F',
        fillColor: '#146B4F',
        fillOpacity: 0.9,
      }).addTo(map).bindPopup('You are here');
    }
  </script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  status: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 2,
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
});
