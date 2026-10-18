import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import type { Store } from '@/components/(tabs)/home/mock';
import Colors from '@/theme/color';

// 이미지가 없는 매장의 대체 썸네일 색 [배경, 글자]
const TINTS: Record<string, [string, string]> = {
  카페: ['#EFE3D3', '#7A4E2D'],
  베이커리: ['#FBE7C6', Colors.yellow],
  샐러드: ['#DCEFD9', Colors.green],
  티: ['#E3E8F4', Colors.secondary],
  디저트: ['#FBDCE4', '#B4234B']
};
const DEFAULT_TINT: [string, string] = [Colors.superUltraLightGray, Colors.darkGray];

type Props = {
  store: Pick<Store, 'name' | 'category' | 'imageUrl'>;
  style: StyleProp<ViewStyle>;
  fontSize: number;
  children?: ReactNode;
};

export default function StoreThumbnail({ store, style, fontSize, children }: Props) {
  const [backgroundColor, color] = TINTS[store.category] ?? DEFAULT_TINT;

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {store.imageUrl ? (
        <Image source={store.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <Text style={[styles.initial, { color, fontSize }]} importantForAccessibility="no">
          {store.name[0]}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initial: { fontFamily: 'Pretendard-ExtraBold', letterSpacing: -1 }
});
