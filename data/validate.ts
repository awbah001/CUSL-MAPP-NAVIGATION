import { CAMPUS_CENTER } from '@/constants/campus';
import type { Place } from '@/types/campus';

import { categories } from './categories';
import { places } from './places';

export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function isValidPlace(place: Place): boolean {
  const categoryExists = categories.some((category) => category.id === place.category_id);
  return categoryExists && isValidCoordinate(place.latitude, place.longitude);
}

/** Problems in the local catalogue. An empty list means the Day One checks passed. */
export function getDatasetIssues(): string[] {
  const issues: string[] = [];

  if (categories.length < 5) {
    issues.push(`Expected at least 5 categories, found ${categories.length}.`);
  }

  if (places.length < 15 || places.length > 25) {
    issues.push(`Expected 15 to 25 places, found ${places.length}.`);
  }

  const categoryIds = new Set(categories.map((category) => category.id));
  const placeIds = new Set<string>();
  const coordinates = new Set<string>();
  let sparseRecords = 0;

  for (const place of places) {
    if (placeIds.has(place.id)) {
      issues.push(`Duplicate place id: ${place.id}.`);
    }
    placeIds.add(place.id);

    if (!categoryIds.has(place.category_id)) {
      issues.push(`${place.id} refers to an unknown category.`);
    }

    if (!isValidCoordinate(place.latitude, place.longitude)) {
      issues.push(`${place.id} has a latitude or longitude outside the valid range.`);
    }

    const coordinateKey = `${place.latitude},${place.longitude}`;
    if (coordinates.has(coordinateKey)) {
      issues.push(`${place.id} repeats coordinates ${coordinateKey}.`);
    }
    coordinates.add(coordinateKey);

    const latitudeOffset = Math.abs(place.latitude - CAMPUS_CENTER.latitude);
    const longitudeOffset = Math.abs(place.longitude - CAMPUS_CENTER.longitude);
    if (latitudeOffset > 0.02 || longitudeOffset > 0.02) {
      issues.push(`${place.id} is far from the campus centre.`);
    }

    if (
      place.building == null &&
      place.floor == null &&
      place.hours == null &&
      place.photo_url == null
    ) {
      sparseRecords += 1;
    }
  }

  if (sparseRecords < 1) {
    issues.push('Expected at least one place with missing optional information.');
  }

  const usedCategories = new Set(places.map((place) => place.category_id));
  if (usedCategories.size < 5) {
    issues.push('Places should use at least five categories.');
  }

  return issues;
}
