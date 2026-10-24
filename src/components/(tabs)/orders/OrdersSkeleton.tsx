import { StyleSheet, View } from 'react-native';

import Skeleton, { SkeletonBlock } from '@/components/Skeleton';

// 날짜 묶음별 주문 수
const GROUPS = [2, 1, 3];

export default function OrdersSkeleton() {
  return (
    <Skeleton>
      <SkeletonBlock width={110} height={28} style={styles.title} />
      {GROUPS.map((count, i) => (
        <View key={i}>
          <SkeletonBlock width={90} height={13} style={styles.day} />
          {Array.from({ length: count }, (_, j) => (
            <View key={j} style={styles.row}>
              <View style={styles.line}>
                <SkeletonBlock width="50%" height={16} />
                <SkeletonBlock width={52} height={13} />
              </View>
              <View style={[styles.line, styles.gap]}>
                <SkeletonBlock width="35%" height={14} />
                <SkeletonBlock width={60} height={14} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </Skeleton>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 22, marginBottom: 4, marginHorizontal: 20 },
  day: { marginTop: 20, marginBottom: 4, marginHorizontal: 20 },
  row: { paddingHorizontal: 20, paddingVertical: 12 },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gap: { marginTop: 6 }
});
