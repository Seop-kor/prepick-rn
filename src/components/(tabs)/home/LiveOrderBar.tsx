import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Order } from '@/components/(tabs)/orders/mock';
import { ORDER_STATUS } from '@/components/(tabs)/orders/status';
import Colors from '@/theme/color';

type Props = { orders: Order[]; bottom: number };

export default function LiveOrderBar({ orders, bottom }: Props) {
  // 픽업 가능한 주문을 먼저 보여준다
  const order = orders.find(({ status }) => status === 'READY') ?? orders[0];
  const { message, messageColor } = ORDER_STATUS[order.status];
  const sub = orders.length > 1 ? `${order.storeName} 외 ${orders.length - 1}건 진행 중` : order.storeName;

  function handlePress() {
    if (orders.length > 1) {
      router.navigate('/orders');
      return;
    }
    // 주문내역 탭으로 바꾼 뒤 목록 위에 상세를 연다
    router.push({ pathname: '/orders/[id]', params: { id: order.id } }, { withAnchor: true });
  }

  return (
    <Pressable
      style={[styles.container, { bottom }]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`진행 중인 주문, 주문번호 ${order.prefixOrderNumber}, ${message}, ${sub}`}
    >
      <View style={styles.tag}>
        <Text style={styles.tagText}>{order.prefixOrderNumber}</Text>
      </View>
      <View style={styles.main}>
        <Text style={[styles.message, { color: messageColor }]} numberOfLines={1}>
          {message}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
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
  tag: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.superUltraLightGray
  },
  tagText: { fontFamily: 'Pretendard-ExtraBold', fontSize: 15, letterSpacing: -0.5 },
  main: { flex: 1 },
  message: { fontFamily: 'Pretendard-Bold', fontSize: 15, letterSpacing: -0.4 },
  sub: { marginTop: 1, fontSize: 13, color: Colors.darkGray }
});
