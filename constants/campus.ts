/**
 * Map centre for Central University, 1 Silicon Hills, Mile 91, Tonkolili.
 *
 * This is the OpenStreetMap centre of the Wesley Penner Building, which is
 * tagged as Central University at housenumber 1, Silicon Hills. Individual
 * place coordinates are OpenStreetMap building or feature centres on that
 * campus. They are not surveyed doorways and still await field verification.
 */
export const CAMPUS_CENTER = {
  latitude: 8.46814,
  longitude: -12.24271,
};

/** Standard OpenStreetMap raster tiles. Attribution is required on the map. */
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

/** Opening view. A delta of 0.008 keeps the Mile 91 campus in frame. */
export const CAMPUS_INITIAL_REGION = {
  latitude: 8.46835,
  longitude: -12.2424,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};
