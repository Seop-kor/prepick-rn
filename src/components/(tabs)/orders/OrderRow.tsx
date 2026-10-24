import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Order } from '@/components/(tabs)/orders/mock';
import { isVoidOrder, ORDER_STATUS } from '@/components/(tabs)/orders/status';
import Colors from '@/theme/color';

type Props = { order: Order };

export default function OrderRow({ order }: Props) {
  const { id, storeName, items, amount, status } = order;
  const { label, labelColor } = ORDER_STATUS[status];
  const isVoid = isVoidOrder(order);
  const menu = items.length > 1 ? `${items[0].productName} 외 ${items.length - 1}개` : items[0].productName;

  function handlePress() {
    router.push({ pathname: '/orders/[id]', params: { id } });
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={handlePress}
      accessibilityRole="button"
    >
      <View style={styles.line}>
        <Text style={styles.store} numberOfLines={1}>
          {storeName}
        </Text>
        <Text style={[styles.status, { color: labelColor }]}>{label}</Text>
      </View>
      <View style={styles.line}>
        <Text style={styles.menu} numberOfLines={1}>
          {menu}
        </Text>
        <Text style={[styles.price, isVoid && styles.priceVoid]}>{`${amount.toLocaleString()}원`}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, paddingVertical: 12 },
  pressed: { backgroundColor: Colors.superUltraLightGray },
  line: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  store: { flex: 1, fontFamily: 'Pretendard-Bold', fontSize: 16, letterSpacing: -0.4 },
  status: { fontFamily: 'Pretendard-SemiBold', fontSize: 13 },
  menu: { flex: 1, marginTop: 3, fontSize: 14, color: Colors.darkGray },
  price: { fontFamily: 'Pretendard-SemiBold', fontSize: 14 },
  priceVoid: { color: Colors.gray, textDecorationLine: 'line-through' }
});
