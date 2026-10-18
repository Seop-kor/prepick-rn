import { Text } from '@rneui/themed';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Store } from '@/components/(tabs)/home/mock';
import StoreThumbnail from '@/components/(tabs)/home/StoreThumbnail';
import Colors from '@/theme/color';
import { formatDistance, toWalkingMinutes } from '@/utils/distance';

type Props = { store: Store };

export default function StoreRow({ store }: Props) {
  const { name, category, isOpen, distanceMeters } = store;

  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
      <StoreThumbnail store={store} style={[styles.thumb, !isOpen && styles.thumbClosed]} fontSize={24} />
      <View style={styles.main}>
        <Text style={[styles.name, !isOpen && styles.closedText]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.category}>{category}</Text>
        <View style={styles.badge}>
          <View style={[styles.dot, !isOpen && styles.dotClosed]} />
          <Text style={[styles.badgeText, !isOpen && styles.closedText]}>
            {isOpen ? '영업 중' : '영업 종료'}
          </Text>
        </View>
      </View>
      {distanceMeters !== null && (
        <View style={styles.walk}>
          <Text style={styles.walkLabel}>
            도보 약{' '}
            <Text style={[styles.walkMinutes, !isOpen && styles.closedText]}>
              {toWalkingMinutes(distanceMeters)}분
            </Text>
          </Text>
          <Text style={styles.meters}>{formatDistance(distanceMeters)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 12 },
  pressed: { backgroundColor: Colors.superUltraLightGray },
  thumb: { width: 64, height: 64, borderRadius: 16 },
  thumbClosed: { opacity: 0.45 },
  main: { flex: 1 },
  name: { fontFamily: 'Pretendard-Bold', fontSize: 16, letterSpacing: -0.4 },
  category: { marginTop: 3, fontSize: 13, color: Colors.darkGray },
  badge: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  dotClosed: { backgroundColor: Colors.gray },
  badgeText: { fontFamily: 'Pretendard-SemiBold', fontSize: 12, color: Colors.green },
  closedText: { color: Colors.gray },
  walk: { alignItems: 'flex-end' },
  walkLabel: { fontSize: 13, color: Colors.darkGray },
  // 중첩된 rneui Text는 테마 폰트를 다시 적용하므로 폰트 지정 반복
  walkMinutes: { fontFamily: 'Pretendard-ExtraBold', fontSize: 22, letterSpacing: -0.8, color: Colors.black },
  meters: { marginTop: 1, fontSize: 12, color: Colors.gray }
});
