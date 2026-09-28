# Campus Navigation

Visitor app for [Central University](https://github.com/awbah001), 1 Silicon Hills, Mile 91, Tonkolili, Sierra Leone. Open it in Expo Go, browse campus places on a map, and get walking directions. No account is required.

Built by [Alhaji Mohamed Wurie Bah](https://github.com/awbah001).

## Features

- **Map** — OpenStreetMap tiles with a marker for each place, plus your position when location is allowed.
- **Places** — Search by name and filter by category. The list is loaded from Supabase.
- **Distance** — When location is allowed, places are sorted nearest-first and each card shows a distance such as `120 m` or `1.4 km`.
- **Place details** — Building, hours, and coordinates. **Navigate** opens walking directions in the device maps app.
- **Resilience** — Loading and connection errors stay on screen instead of crashing. An empty search shows a clear message. Denying location keeps the original list, without distances.

The Tour tab is a placeholder for a later guided walk.

## Stack

- [Expo SDK 57](https://docs.expo.dev/) and Expo Router
- React Native and TypeScript
- [Supabase](https://supabase.com/) for categories and places (public read only)
- `expo-location` for foreground GPS
- `react-native-maps` with OpenStreetMap tiles

## Prerequisites

- Node.js 20 or newer
- The Expo Go app on an Android phone
- A Supabase project with the `categories` and `places` tables, Row Level Security enabled, and a public read policy

Phone and laptop need to be on the same Wi-Fi network while you use Expo Go.

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. Saving a file refreshes the running app.

### Environment variables

Create a `.env` file in the project root. Do not commit it. Restart the dev server after any change to this file.

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use the project URL and the **publishable** key from Supabase → Project Settings → API. Never put the secret or `service_role` key in the app.

## Project layout

| Path | Role |
| --- | --- |
| `app/(tabs)/index.tsx` | Map tab |
| `app/(tabs)/places.tsx` | Searchable directory |
| `app/(tabs)/tour.tsx` | Tour placeholder |
| `app/place/[id].tsx` | Place details and Navigate |
| `components/CampusMap.tsx` | Native map |
| `components/libs/supabase.ts` | Shared Supabase client |
| `data/live.ts` | Fetch and map live rows |
| `hooks/useCampusDirectory.ts` | Loading, error, and place data |
| `hooks/useUserLocation.ts` | Foreground location |
| `lib/distance.ts` | Haversine distance |
| `lib/directions.ts` | Walking-directions link |

## Campus data

Coordinates are approximate OpenStreetMap centres for campus features. They are not surveyed doorways. The map opens near the Wesley Penner Building (`8.46814`, `-12.24271`).

Map tiles are © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

## License

This project is for learning and campus use. Map data remains under the [OpenStreetMap licence](https://www.openstreetmap.org/copyright).
