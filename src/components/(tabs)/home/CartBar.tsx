import { Text } from '@rneui/themed';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Store } from '@/components/(tabs)/home/mock';
import StoreThumbnail from '@/components/(tabs)/home/StoreThumbnail';
import Colors from '@/theme/color';

type Props = {
  store: Pick<Store, 'name' | 'category' | 'imageUrl'>;
  itemCount: number;
  totalPrice: number;
};

export default function CartBar({ store, itemCount, totalPrice }: Props) {
  const price = `${totalPrice.toLocaleString()}원`;

  return (
    <Pressable
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={`${store.name} 장바구니 보기, 메뉴 ${itemCount}개, ${price}`}
    >
      <StoreThumbnail store={store} style={styles.thumb} fontSize={17} />
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.sub}>장바구니 메뉴 {itemCount}개</Text>
      </View>
      <Text style={styles.price}>{price}</Text>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={14}
        tintColor={Colors.black}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ultraLightGray,
    backgroundColor: Colors.white,
    boxShadow: '0 14px 28px -14px rgba(37, 37, 37, 0.35)'
  },
  thumb: { width: 44, height: 44, borderRadius: 12 },
  main: { flex: 1 },
  name: { fontFamily: 'Pretendard-Bold', fontSize: 15, letterSpacing: -0.4 },
  sub: { marginTop: 1, fontSize: 13, color: Colors.darkGray },
  price: { fontFamily: 'Pretendard-ExtraBold', fontSize: 17, letterSpacing: -0.4 }
});
