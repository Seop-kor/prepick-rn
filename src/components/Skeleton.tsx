import { type ReactNode, useEffect } from 'react';
import { type DimensionValue, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

export default function Skeleton({ children }: { children: ReactNode }) {
  const opacity = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.55, { duration: 700 }), -1, true));
  }, [opacity]);

  return (
    <SafeAreaView style={styles.container} edges={['top']} accessibilityLabel="불러오는 중">
      <Animated.View style={pulseStyle}>{children}</Animated.View>
    </SafeAreaView>
  );
}

export function SkeletonBlock({
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
  block: { borderRadius: 8, backgroundColor: Colors.superUltraLightGray }
});
