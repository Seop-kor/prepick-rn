import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native';

import type { Promotion } from '@/components/(tabs)/home/mock';
import Colors from '@/theme/color';

const GAP = 10;
const BACKGROUNDS = [Colors.primary, Colors.secondary, Colors.black];

type Props = { promotions: Promotion[] };

export default function PromotionCarousel({ promotions }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const itemWidth = width - 40;

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(e.nativeEvent.contentOffset.x / (itemWidth + GAP));
    setIndex(Math.min(Math.max(next, 0), promotions.length - 1));
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {promotions.map((promotion, i) => (
          <View
            key={promotion.id}
            style={[styles.item, { width: itemWidth, backgroundColor: BACKGROUNDS[i % BACKGROUNDS.length] }]}
          >
            {!!promotion.imageUrl && (
              <Image source={promotion.imageUrl} style={styles.image} contentFit="contain" />
            )}
            <Text style={styles.title}>{promotion.title}</Text>
            <Text style={styles.description}>{promotion.description}</Text>
          </View>
        ))}
      </ScrollView>
      {promotions.length > 1 && (
        <View style={styles.count}>
          <Text style={styles.countText}>{`${index + 1} / ${promotions.length}`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: GAP, paddingHorizontal: 20 },
  item: { height: 148, borderRadius: 20, paddingVertical: 22, paddingHorizontal: 20, overflow: 'hidden' },
  image: { position: 'absolute', right: -10, bottom: -14, width: 140, height: 140 },
  title: {
    maxWidth: 200,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 20,
    lineHeight: 27,
    letterSpacing: -0.6,
    color: Colors.white
  },
  description: {
    maxWidth: 190,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.white,
    opacity: 0.88
  },
  count: {
    position: 'absolute',
    right: 34,
    bottom: 12,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 11,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    pointerEvents: 'none'
  },
  countText: { fontFamily: 'Pretendard-SemiBold', fontSize: 11, color: Colors.white }
});
