/** Chip value that removes the category restriction. */
export const ALL_CATEGORIES_ID = 'all';

type FilterablePlace = {
  name: string;
  category_id: string;
};

/**
 * Places visible for the current search and category.
 * A place is included when its name matches the query AND it belongs to the
 * selected category, unless All is selected. The input array is not changed.
 */
export function filterPlaces<T extends FilterablePlace>(
  places: readonly T[],
  query: string,
  categoryId: string,
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  return places.filter((place) => {
    const matchesQuery =
      normalizedQuery.length === 0 || place.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory = categoryId === ALL_CATEGORIES_ID || place.category_id === categoryId;
    return matchesQuery && matchesCategory;
  });
}
