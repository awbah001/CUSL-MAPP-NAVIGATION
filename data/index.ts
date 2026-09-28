import type { Place } from '@/types/campus';

import { categories } from './categories';
import { places } from './places';
import { getDatasetIssues, isValidPlace } from './validate';

export { categories } from './categories';
export { ALL_CATEGORIES_ID, filterPlaces } from './filterPlaces';
export { places } from './places';
export { getDatasetIssues, isValidCoordinate, isValidPlace } from './validate';

export function getCategoryName(categoryId: string): string {
  return categories.find((category) => category.id === categoryId)?.name ?? 'Unknown category';
}

export function getPlaceById(id: string): Place | undefined {
  return places.find((place) => place.id === id);
}

/** Records safe to draw as map markers. */
export const validPlaces = places.filter(isValidPlace);

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  const issues = getDatasetIssues();
  if (issues.length > 0) {
    console.warn(`Campus dataset needs attention:\n${issues.join('\n')}`);
  }
}
