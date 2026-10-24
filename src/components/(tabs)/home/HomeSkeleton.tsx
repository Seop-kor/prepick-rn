import { StyleSheet, View } from 'react-native';

import Skeleton, { SkeletonBlock } from '@/components/Skeleton';

export default function HomeSkeleton() {
  return (
    <Skeleton>
      <View style={styles.hello}>
        <SkeletonBlock width={120} height={16} />
        <SkeletonBlock width={240} height={28} style={styles.gapLarge} />
        <SkeletonBlock width={190} height={28} style={styles.gapSmall} />
      </View>
      <SkeletonBlock height={50} style={[styles.inset, styles.search]} />
      <SkeletonBlock height={148} style={[styles.inset, styles.banner]} />
      <SkeletonBlock width={110} height={22} style={[styles.inset, styles.sectionTitle]} />
      {Array.from({ length: 4 }, (_, i) => (
        <View key={i} style={styles.row}>
          <SkeletonBlock width={64} height={64} style={styles.thumb} />
          <View style={styles.rowMain}>
            <SkeletonBlock width="60%" height={16} />
            <SkeletonBlock width="30%" height={12} style={styles.gapSmall} />
          </View>
          <SkeletonBlock width={48} height={22} />
        </View>
      ))}
    </Skeleton>
  );
}

const styles = StyleSheet.create({
  hello: { paddingHorizontal: 20, paddingTop: 22 },
  gapLarge: { marginTop: 12 },
  gapSmall: { marginTop: 8 },
  inset: { marginHorizontal: 20 },
  search: { marginTop: 20, borderRadius: 14 },
  banner: { marginTop: 24, borderRadius: 20 },
  sectionTitle: { marginTop: 36, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 12 },
  thumb: { borderRadius: 16 },
  rowMain: { flex: 1 }
});
