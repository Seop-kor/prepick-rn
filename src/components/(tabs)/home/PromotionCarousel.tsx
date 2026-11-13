import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Carousel, type CarouselPanGesture } from 'react-native-reanimated-carousel';

import type { Promotion } from '@/graphql/queries';
import Colors from '@/theme/color';

const HEIGHT = 148;
const AUTOPLAY_INTERVAL_MS = 4 * 1000;
const BACKGROUNDS = [Colors.primary, Colors.secondary, Colors.black];

type Props = { promotions: Promotion[] };

// 세로 스크롤을 가로 스와이프로 가로채지 않게 한다
function configurePanGesture(gesture: CarouselPanGesture) {
  gesture.activeOffsetX([-10, 10]).failOffsetY([-10, 10]);
}

export default function PromotionCarousel({ promotions }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const hasMany = promotions.length > 1;

  return (
    <View>
      <Carousel
        style={{ width, height: HEIGHT }}
        data={promotions}
        keyExtractor={(promotion) => promotion.id}
        loop={hasMany}
        autoplay={hasMany}
        autoplayInterval={AUTOPLAY_INTERVAL_MS}
        onConfigurePanGesture={configurePanGesture}
        onSnapToItem={setIndex}
        renderItem={({ item, index: i }) => (
          <View style={[styles.item, { backgroundColor: BACKGROUNDS[i % BACKGROUNDS.length] }]}>
            {!!item.imageUrl && (
              <Image source={item.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      {hasMany && (
        <View style={styles.count}>
          <Text style={styles.countText}>{`${index + 1} / ${promotions.length}`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    overflow: 'hidden'
  },
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
