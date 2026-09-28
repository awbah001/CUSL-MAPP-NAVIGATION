import { ALL_CATEGORIES_ID, filterPlaces, getDatasetIssues, places } from '../data';

const issues = getDatasetIssues();

function expect(condition: boolean, message: string) {
  if (!condition) {
    issues.push(message);
  }
}

const names = (query: string, categoryId: string) =>
  filterPlaces(places, query, categoryId).map((place) => place.name);

expect(names('CAN', ALL_CATEGORIES_ID).includes('CUSL Canteen'), 'CAN should match CUSL Canteen.');
expect(names('can', ALL_CATEGORIES_ID).includes('CUSL Canteen'), 'can should match CUSL Canteen.');
expect(
  names('  can  ', ALL_CATEGORIES_ID).includes('CUSL Canteen'),
  'Outer spaces should not change the canteen search.',
);
expect(names('zzzz-not-a-place', ALL_CATEGORIES_ID).length === 0, 'Unknown query should match nothing.');

const health = filterPlaces(places, '', 'health');
expect(
  health.length > 0 && health.every((place) => place.category_id === 'health'),
  'Health filter should return only health places.',
);

const combined = filterPlaces(places, 'lab', 'academic');
expect(
  combined.length === 1 && combined[0]?.id === 'place-electronic-lab',
  'Search and category should both apply.',
);

const healthMatch = filterPlaces(places, 'health', 'health');
expect(
  healthMatch.length === 1 && healthMatch[0]?.id === 'place-community-health',
  'Health plus health should return only Community Health Foundation.',
);

const before = places.map((place) => place.id).join(',');
filterPlaces(places, 'lib', 'academic');
expect(places.map((place) => place.id).join(',') === before, 'Filtering should not change the dataset.');
expect(
  filterPlaces(places, '', ALL_CATEGORIES_ID).length === places.length,
  'An empty query with All should return every place.',
);

const sparse = places.find((place) => place.id === 'place-nice-park');
expect(
  sparse != null &&
    sparse.building == null &&
    sparse.floor == null &&
    sparse.hours == null &&
    sparse.photo_url == null,
  'Nice Park should be the sparse record.',
);

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Campus checks passed for ${places.length} places.`);
