import * as Location from 'expo-location';
import { create } from 'zustand';

export type Coords = { latitude: number; longitude: number };
export type LocationPermission = 'unknown' | 'granted' | 'denied';

type LocationState = {
  permission: LocationPermission;
  // 실행당 한 번 정하고 고정
  coords: Coords | null;
  locationName: string | null;
  hasLocateFailed: boolean;
};

const FALLBACK_LOCATION_NAME = '현재 위치';

const useLocationStore = create<LocationState>()(() => ({
  permission: 'unknown',
  coords: null,
  locationName: null,
  hasLocateFailed: false
}));

let initializing: Promise<void> | null = null;
let locating: Promise<void> | null = null;

function toPermission(status: Location.PermissionStatus): LocationPermission {
  if (status === Location.PermissionStatus.GRANTED) return 'granted';
  if (status === Location.PermissionStatus.DENIED) return 'denied';
  return 'unknown';
}

async function readCoords(): Promise<Coords | null> {
  try {
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: coords.latitude, longitude: coords.longitude };
  } catch {
    const last = await Location.getLastKnownPositionAsync().catch(() => null);
    return last ? { latitude: last.coords.latitude, longitude: last.coords.longitude } : null;
  }
}

async function readLocationName(coords: Coords) {
  try {
    const [address] = await Location.reverseGeocodeAsync(coords);
    return address?.district || address?.subregion || address?.city || FALLBACK_LOCATION_NAME;
  } catch {
    return FALLBACK_LOCATION_NAME;
  }
}

// 동시 호출은 하나로 합치고, 실패하면 다음 호출 때 다시 시도
function locate() {
  if (useLocationStore.getState().coords) return Promise.resolve();
  locating ??= (async () => {
    const coords = await readCoords();
    if (!coords) {
      useLocationStore.setState({ hasLocateFailed: true });
      return;
    }
    useLocationStore.setState({ coords, hasLocateFailed: false });
    useLocationStore.setState({ locationName: await readLocationName(coords) });
  })().finally(() => (locating = null));
  return locating;
}

async function applyPermission(status: Location.PermissionStatus) {
  const permission = toPermission(status);
  useLocationStore.setState({ permission });
  if (permission === 'granted') await locate();
}

// hooks
export function useLocationPermission() {
  return useLocationStore((state) => state.permission);
}

export function useCoords() {
  return useLocationStore((state) => state.coords);
}

export function useLocationName() {
  return useLocationStore((state) => state.locationName);
}

export function useHasLocateFailed() {
  return useLocationStore((state) => state.hasLocateFailed);
}

// getter
export function getLocationPermission() {
  return useLocationStore.getState().permission;
}

export function getCoords() {
  return useLocationStore.getState().coords;
}

export function getLocationName() {
  return useLocationStore.getState().locationName;
}

export function getHasLocateFailed() {
  return useLocationStore.getState().hasLocateFailed;
}

// actions
// 권한 팝업은 물어본 적 없을 때 여기서 한 번만 띄운다
export function initLocation() {
  initializing ??= (async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status === Location.PermissionStatus.UNDETERMINED) {
      ({ status } = await Location.requestForegroundPermissionsAsync());
    }
    await applyPermission(status);
  })();
  return initializing;
}

// 팝업 없이 상태만 다시 읽는다
export async function refreshLocationPermission() {
  const { status } = await Location.getForegroundPermissionsAsync();
  await applyPermission(status);
}
