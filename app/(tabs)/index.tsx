import { CampusMap } from '@/components/CampusMap';
import { useCampusDirectory } from '@/hooks/useCampusDirectory';
import { useUserLocation } from '@/hooks/useUserLocation';

export default function MapScreen() {
  const directory = useCampusDirectory();
  const location = useUserLocation();

  return (
    <CampusMap
      places={directory.places}
      loading={directory.loading}
      error={directory.error}
      onRetry={() => {
        void directory.reload();
      }}
      userLocation={location.coordinates}
    />
  );
}
