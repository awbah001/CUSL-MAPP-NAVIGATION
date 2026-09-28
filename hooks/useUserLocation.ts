import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let active = true;

    async function start() {
      try {
        const result = await Location.requestForegroundPermissionsAsync();
        if (!active) {
          return;
        }
        if (result.status !== Location.PermissionStatus.GRANTED) {
          setPermission('denied');
          return;
        }
        setPermission('granted');
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!active) {
          return;
        }
        setCoordinates({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
          },
          (position) => {
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
        );
      } catch {
        if (active) {
          setPermission('denied');
          setCoordinates(null);
        }
      }
    }

    void start();
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return { coordinates, permission };
}
