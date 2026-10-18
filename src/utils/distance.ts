// 시속 4km. distanceMeters는 직선거리라 평균 보행 속도(약 78m/분)보다 느리게 잡아 실제 경로와의 차이를 메운다
const WALKING_METERS_PER_MINUTE = 67;

export function toWalkingMinutes(meters: number) {
  return Math.max(1, Math.ceil(meters / WALKING_METERS_PER_MINUTE));
}

export function formatDistance(meters: number) {
  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;
}
