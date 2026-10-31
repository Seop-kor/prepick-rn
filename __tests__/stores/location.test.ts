import { beforeEach, expect, jest, test } from '@jest/globals';
import type * as ExpoLocation from 'expo-location';

import type * as LocationStore from '@/stores/location';

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' }
}));

let Location: jest.MockedObject<typeof ExpoLocation>;
let store: typeof LocationStore;

function permission(status: 'granted' | 'denied' | 'undetermined') {
  return {
    status: status as ExpoLocation.PermissionStatus,
    granted: status === 'granted',
    canAskAgain: true,
    expires: 'never' as const
  };
}

function position(latitude: number, longitude: number) {
  return {
    coords: {
      latitude,
      longitude,
      altitude: null,
      accuracy: 10,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: 0
  };
}

function address(
  overrides: Partial<ExpoLocation.LocationGeocodedAddress>
): ExpoLocation.LocationGeocodedAddress {
  return {
    city: '서울',
    district: '역삼동',
    streetNumber: null,
    street: null,
    region: '서울특별시',
    subregion: '강남구',
    country: '대한민국',
    postalCode: null,
    name: null,
    isoCountryCode: 'KR',
    timezone: null,
    formattedAddress: null,
    ...overrides
  };
}

function setPermission(status: 'granted' | 'denied' | 'undetermined') {
  Location.getForegroundPermissionsAsync.mockResolvedValue(permission(status));
}

beforeEach(() => {
  jest.resetModules();
  Location = jest.requireMock<jest.MockedObject<typeof ExpoLocation>>('expo-location');
  store = jest.requireActual<typeof LocationStore>('@/stores/location');
  Location.requestForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
  Location.getCurrentPositionAsync.mockResolvedValue(position(37.5, 127.03));
  Location.getLastKnownPositionAsync.mockResolvedValue(null);
  Location.reverseGeocodeAsync.mockResolvedValue([address({})]);
});

test('권한을 물어본 적 없으면 init 때 팝업을 요청한다', async () => {
  setPermission('undetermined');

  await store.initLocation();

  expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
  expect(store.getLocationPermission()).toBe('granted');
  expect(store.getCoords()).toEqual({ latitude: 37.5, longitude: 127.03 });
  expect(store.getLocationName()).toBe('역삼동');
});

test('이미 거부했으면 init 때 팝업을 요청하지 않는다', async () => {
  setPermission('denied');

  await store.initLocation();

  expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  expect(store.getLocationPermission()).toBe('denied');
  expect(store.getCoords()).toBeNull();
});

test('refresh는 권한을 물어본 적 없어도 팝업을 요청하지 않는다', async () => {
  setPermission('undetermined');

  await store.refreshLocationPermission();

  expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  expect(store.getLocationPermission()).toBe('unknown');
});

test('refresh는 거부 상태에서 팝업을 요청하지 않는다', async () => {
  setPermission('denied');

  await store.refreshLocationPermission();

  expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  expect(store.getLocationPermission()).toBe('denied');
});

test('init을 두 번 호출해도 좌표는 한 번만 가져온다', async () => {
  setPermission('granted');

  await store.initLocation();
  await store.initLocation();

  expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
});

test('init과 refresh가 동시에 실행돼도 좌표는 한 번만 가져온다', async () => {
  setPermission('granted');

  await Promise.all([store.initLocation(), store.refreshLocationPermission()]);

  expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
});

test('좌표가 있으면 refresh 때 좌표를 다시 가져오지 않는다', async () => {
  setPermission('granted');

  await store.initLocation();
  await store.refreshLocationPermission();

  expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
});

test('시작 때 거부였다가 refresh 때 허용이면 그때 좌표를 가져온다', async () => {
  setPermission('denied');
  await store.initLocation();

  setPermission('granted');
  await store.refreshLocationPermission();

  expect(store.getLocationPermission()).toBe('granted');
  expect(store.getCoords()).toEqual({ latitude: 37.5, longitude: 127.03 });
});

test('권한이 꺼지면 좌표가 있어도 denied가 된다', async () => {
  setPermission('granted');
  await store.initLocation();

  setPermission('denied');
  await store.refreshLocationPermission();

  expect(store.getLocationPermission()).toBe('denied');
  expect(store.getCoords()).toEqual({ latitude: 37.5, longitude: 127.03 });
});

test('현재 위치를 못 가져오면 마지막 위치로 대체한다', async () => {
  setPermission('granted');
  Location.getCurrentPositionAsync.mockRejectedValue(new Error('timeout'));
  Location.getLastKnownPositionAsync.mockResolvedValue(position(37.4, 127.1));

  await store.initLocation();

  expect(store.getCoords()).toEqual({ latitude: 37.4, longitude: 127.1 });
  expect(store.getHasLocateFailed()).toBe(false);
});

test('둘 다 실패하면 실패 상태가 되고 다음 refresh 때 다시 시도한다', async () => {
  setPermission('granted');
  Location.getCurrentPositionAsync.mockRejectedValue(new Error('location services off'));

  await store.initLocation();

  expect(store.getHasLocateFailed()).toBe(true);
  expect(store.getCoords()).toBeNull();

  Location.getCurrentPositionAsync.mockResolvedValue(position(37.5, 127.03));
  await store.refreshLocationPermission();

  expect(store.getHasLocateFailed()).toBe(false);
  expect(store.getCoords()).toEqual({ latitude: 37.5, longitude: 127.03 });
});

test('동이 없으면 구를 이름으로 쓴다', async () => {
  setPermission('granted');
  Location.reverseGeocodeAsync.mockResolvedValue([address({ district: null })]);

  await store.initLocation();

  expect(store.getLocationName()).toBe('강남구');
});

test('동과 구가 없으면 시를 이름으로 쓴다', async () => {
  setPermission('granted');
  Location.reverseGeocodeAsync.mockResolvedValue([address({ district: '', subregion: null })]);

  await store.initLocation();

  expect(store.getLocationName()).toBe('서울');
});

test('주소 조회가 실패하면 현재 위치라고 표시한다', async () => {
  setPermission('granted');
  Location.reverseGeocodeAsync.mockRejectedValue(new Error('geocoder unavailable'));

  await store.initLocation();

  expect(store.getLocationName()).toBe('현재 위치');
});

test('주소 결과가 없으면 현재 위치라고 표시한다', async () => {
  setPermission('granted');
  Location.reverseGeocodeAsync.mockResolvedValue([]);

  await store.initLocation();

  expect(store.getLocationName()).toBe('현재 위치');
});
