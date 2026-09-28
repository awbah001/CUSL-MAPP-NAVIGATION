import { supabase } from '@/components/libs/supabase';

export type LiveCategory = {
  id: string;
  label: string;
  emoji: string;
};

export type LivePlace = {
  id: string;
  name: string;
  category_id: string;
  categoryLabel: string;
  categoryEmoji: string;
  description: string;
  building: string | null;
  hours: string | null;
  latitude: number;
  longitude: number;
};

type CategoryRow = {
  id: string;
  label: string;
  emoji: string;
};

type PlaceRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  building: string | null;
  hours: string | null;
  latitude: number;
  longitude: number;
  categories: CategoryRow | CategoryRow[] | null;
};

const PLACE_COLUMNS =
  'id, name, category, description, building, hours, latitude, longitude, categories(id, label, emoji)';

function categoryFrom(row: PlaceRow): CategoryRow | null {
  if (Array.isArray(row.categories)) {
    return row.categories[0] ?? null;
  }
  return row.categories;
}

export function mapPlaceRow(row: PlaceRow): LivePlace {
  const category = categoryFrom(row);
  return {
    id: row.id,
    name: row.name,
    category_id: row.category,
    categoryLabel: category?.label ?? row.category,
    categoryEmoji: category?.emoji ?? '',
    description: row.description?.trim() ? row.description : 'No description available',
    building: row.building,
    hours: row.hours,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export async function fetchCampusDirectory(): Promise<{
  places: LivePlace[];
  categories: LiveCategory[];
}> {
  const [placesResult, categoriesResult] = await Promise.all([
    supabase.from('places').select(PLACE_COLUMNS).order('created_at', { ascending: true }),
    supabase.from('categories').select('id, label, emoji').order('label', { ascending: true }),
  ]);

  if (placesResult.error) {
    throw new Error(placesResult.error.message);
  }
  if (categoriesResult.error) {
    throw new Error(categoriesResult.error.message);
  }

  return {
    places: ((placesResult.data ?? []) as PlaceRow[]).map(mapPlaceRow),
    categories: (categoriesResult.data ?? []) as LiveCategory[],
  };
}

export async function fetchPlaceById(id: string): Promise<LivePlace | null> {
  const { data, error } = await supabase
    .from('places')
    .select(PLACE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return mapPlaceRow(data as PlaceRow);
}
