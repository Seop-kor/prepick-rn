import { Text } from '@rneui/themed';
import { differenceInCalendarDays } from 'date-fns';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Store } from '@/components/(tabs)/home/mock';
import StoreThumbnail from '@/components/(tabs)/home/StoreThumbnail';
import Colors from '@/theme/color';
import { formatDistance } from '@/utils/distance';

type Props = { store: Store };

export default function NewStoreCard({ store }: Props) {
  const days = differenceInCalendarDays(new Date(), store.createdAt);

  return (
    <Pressable style={styles.card} accessibilityRole="button">
      <StoreThumbnail store={store} style={styles.thumb} fontSize={34}>
        <View style={styles.opened}>
          <Text style={styles.openedText}>{days === 0 ? '오늘 오픈' : `${days}일 전 오픈`}</Text>
        </View>
      </StoreThumbnail>
      <Text style={styles.name} numberOfLines={1}>
        {store.name}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{store.category}</Text>
        {store.distanceMeters !== null && (
          <Text style={styles.metaText}>{formatDistance(store.distanceMeters)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 150 },
  thumb: { width: 150, height: 112, borderRadius: 18 },
  opened: {
    position: 'absolute',
    left: 8,
    top: 8,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    justifyContent: 'center',
    backgroundColor: Colors.white
  },
  openedText: { fontFamily: 'Pretendard-Bold', fontSize: 11 },
  name: { marginTop: 10, fontFamily: 'Pretendard-Bold', fontSize: 15, letterSpacing: -0.4 },
  meta: { marginTop: 2, flexDirection: 'row', gap: 8 },
  metaText: { fontSize: 13, color: Colors.darkGray }
});
