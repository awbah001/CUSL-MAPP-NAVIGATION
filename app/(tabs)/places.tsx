import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CategoryChip } from '@/components/CategoryChip';
import { PlaceCard } from '@/components/PlaceCard';
import { theme } from '@/constants/theme';
import { ALL_CATEGORIES_ID, filterPlaces } from '@/data';
import { useCampusDirectory } from '@/hooks/useCampusDirectory';
import { useUserLocation } from '@/hooks/useUserLocation';
import { formatDistance, haversineMeters } from '@/lib/distance';

export default function PlacesScreen() {
  const router = useRouter();
  const directory = useCampusDirectory();
  const location = useUserLocation();
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORIES_ID);

  const orderedPlaces = useMemo(() => {
    if (!location.coordinates) {
      return directory.places.map((place) => ({ ...place, distanceLabel: null as string | null }));
    }
    return directory.places
      .map((place) => {
        const meters = haversineMeters(location.coordinates!, {
          latitude: place.latitude,
          longitude: place.longitude,
        });
        return { ...place, meters, distanceLabel: formatDistance(meters) };
      })
      .sort((left, right) => left.meters - right.meters);
  }, [directory.places, location.coordinates]);

  const visiblePlaces = filterPlaces(orderedPlaces, query, selectedCategoryId);
  const countLabel = `${visiblePlaces.length} ${visiblePlaces.length === 1 ? 'place' : 'places'}`;

  function clearFilters() {
    setQuery('');
    setSelectedCategoryId(ALL_CATEGORIES_ID);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.controls}>
        <Text style={styles.intro}>1 Silicon Hills, Mile 91, Tonkolili.</Text>
        <View style={styles.searchWrap}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor={theme.muted}
            size={18}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by place name"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Search by place name"
            style={styles.search}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          <CategoryChip
            label="All"
            selected={selectedCategoryId === ALL_CATEGORIES_ID}
            onPress={() => setSelectedCategoryId(ALL_CATEGORIES_ID)}
          />
          {directory.categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={`${category.emoji} ${category.label}`.trim()}
              selected={selectedCategoryId === category.id}
              onPress={() => setSelectedCategoryId(category.id)}
            />
          ))}
        </ScrollView>
        <Text accessibilityLiveRegion="polite" style={styles.count}>
          {directory.loading ? 'Loading places…' : `Showing ${countLabel}`}
        </Text>
      </View>
      {directory.loading ? (
        <View style={styles.status}>
          <ActivityIndicator color={theme.accent} />
          <Text style={styles.statusText}>Loading campus places…</Text>
        </View>
      ) : directory.error ? (
        <View style={styles.status}>
          <Text style={styles.statusText}>
            Could not load places. Check your connection and try again.
          </Text>
          <Text style={styles.statusDetail}>{directory.error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try loading places again"
            onPress={() => {
              void directory.reload();
            }}
            style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}>
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visiblePlaces}
          keyExtractor={(place) => place.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.list, visiblePlaces.length === 0 && styles.listEmpty]}
          renderItem={({ item }) => (
            <PlaceCard
              name={item.name}
              categoryName={item.categoryLabel}
              building={item.building}
              description={item.description}
              distanceLabel={item.distanceLabel}
              onPress={() =>
                router.push({
                  pathname: '/place/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyMark}>
                <Text style={styles.emptyMarkText}>?</Text>
              </View>
              <Text style={styles.emptyText}>No places found. Try another search or category.</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear filters"
                onPress={clearFilters}
                style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}>
                <Text style={styles.clearLabel}>Clear filters</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
  },
  intro: {
    color: theme.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  searchWrap: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: theme.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    minHeight: 48,
    color: theme.text,
    fontSize: 16,
  },
  chips: {
    gap: 8,
    paddingRight: 8,
  },
  count: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 12,
  },
  statusText: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  statusDetail: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  retry: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: theme.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryPressed: {
    opacity: 0.86,
  },
  retryLabel: {
    color: theme.onAccent,
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 16,
  },
  emptyMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMarkText: {
    color: theme.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  emptyText: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  clearButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: theme.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonPressed: {
    opacity: 0.86,
  },
  clearLabel: {
    color: theme.onAccent,
    fontSize: 16,
    fontWeight: '700',
  },
});
