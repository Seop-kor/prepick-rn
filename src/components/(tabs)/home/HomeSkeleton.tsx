import { useEffect } from 'react';
import { type DimensionValue, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

export default function HomeSkeleton() {
  const opacity = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.55, { duration: 700 }), -1, true));
  }, [opacity]);

  return (
    <SafeAreaView style={styles.container} edges={['top']} accessibilityLabel="불러오는 중">
      <Animated.View style={pulseStyle}>
        <View style={styles.hello}>
          <Block width={120} height={16} />
          <Block width={240} height={28} style={styles.gapLarge} />
          <Block width={190} height={28} style={styles.gapSmall} />
        </View>
        <Block height={50} style={[styles.inset, styles.search]} />
        <Block height={148} style={[styles.inset, styles.banner]} />
        <Block width={110} height={22} style={[styles.inset, styles.sectionTitle]} />
        {Array.from({ length: 4 }, (_, i) => (
          <View key={i} style={styles.row}>
            <Block width={64} height={64} style={styles.thumb} />
            <View style={styles.rowMain}>
              <Block width="60%" height={16} />
              <Block width="30%" height={12} style={styles.gapSmall} />
            </View>
            <Block width={48} height={22} />
          </View>
        ))}
      </Animated.View>
    </SafeAreaView>
  );
}

function Block({
  width,
  height,
  style
}: {
  width?: DimensionValue;
  height: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.block, { width, height }, style]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  block: { borderRadius: 8, backgroundColor: Colors.superUltraLightGray },
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
