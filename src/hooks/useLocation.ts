import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  label: string;
  loading: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    label: '',
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) {
        setState(s => ({ ...s, loading: false }));
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (cancelled) return;

      const { latitude, longitude } = position.coords;

      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (cancelled) return;

      const label = place
        ? [place.district ?? place.subregion ?? place.city, place.isoCountryCode]
            .filter(Boolean)
            .join(', ')
        : '';

      setState({ coords: { latitude, longitude }, label, loading: false });
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
