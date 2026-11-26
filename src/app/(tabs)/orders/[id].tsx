import { Text } from '@rneui/themed';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OrderStepper from '@/components/(tabs)/orders/OrderStepper';
import { isVoidOrder, ORDER_STATUS } from '@/components/(tabs)/orders/status';
import AlertModal from '@/components/AlertModal';
import { useOrder } from '@/tanstack/hooks';
import Colors from '@/theme/color';

const DATE_FORMAT = 'yyyy.MM.dd HH:mm';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isPending, isError, isFetching, refetch } = useOrder(id);

  function handleBack() {
    router.back();
  }

  function handleRetry() {
    refetch();
  }

  function handleStorePress() {
    // TODO: 매장 상세 화면 작업 시 order.storeId로 이동
  }

  if (isPending) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={handleBack} />
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.gray} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={handleBack} />
        <AlertModal
          isVisible
          title="주문 정보를 불러오지 못했어요"
          message="네트워크 연결을 확인하고 다시 시도해주세요."
          buttonTitle="다시 시도"
          isLoading={isFetching}
          onClose={handleRetry}
        />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={handleBack} />
        <Text style={styles.notFound}>주문 정보를 찾을 수 없어요.</Text>
      </SafeAreaView>
    );
  }

  const { storeName, prefixOrderNumber, status, items, amount, request, createdAt, paidAt } = order;
  const { message, messageColor, step } = ORDER_STATUS[status];
  const isVoid = isVoidOrder(order);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.headRow}>
            <View style={styles.headMain}>
              <Text style={styles.store}>{storeName}</Text>
              <Text
                style={[styles.message, { color: messageColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {message}
              </Text>
            </View>
            {step !== null && (
              <View style={styles.number}>
                <Text style={styles.numberLabel}>주문번호</Text>
                <Text style={styles.numberValue}>{prefixOrderNumber}</Text>
              </View>
            )}
          </View>
          {step !== null && <OrderStepper step={step} />}
        </View>

        <View style={styles.band} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 메뉴</Text>
          {items.map(({ id: itemId, productName, skuName, quantity, price }) => (
            <View key={itemId} style={styles.item}>
              <Text style={styles.itemName}>
                {productName}{' '}
                <Text style={styles.itemOption}>
                  {skuName} × {quantity}
                </Text>
              </Text>
              <Text style={styles.itemName}>{`${(price * quantity).toLocaleString()}원`}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>총 주문 금액</Text>
            <Text
              style={[styles.totalValue, isVoid && styles.totalVoid]}
            >{`${amount.toLocaleString()}원`}</Text>
          </View>
        </View>

        <View style={styles.band} />
        <View style={styles.section}>
          <InfoRow label="주문번호" value={prefixOrderNumber} />
          <InfoRow label="요청사항" value={request} />
          <InfoRow label="주문 일시" value={format(new Date(createdAt), DATE_FORMAT)} />
          <InfoRow label="결제 일시" value={format(new Date(paidAt), DATE_FORMAT)} />
        </View>

        <View style={styles.band} />
        <Pressable
          style={({ pressed }) => [styles.storeLink, pressed && styles.pressed]}
          onPress={handleStorePress}
          accessibilityRole="button"
        >
          <Text style={styles.storeLinkText}>매장 보기</Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            tintColor={Colors.darkGray}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.back} onPress={onBack} accessibilityRole="button" accessibilityLabel="뒤로">
        <SymbolView
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={22}
          tintColor={Colors.black}
        />
      </Pressable>
      <Text style={styles.headerTitle} accessibilityRole="header">
        주문 상세
      </Text>
      <View style={styles.back} />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !value && styles.infoEmpty]}>{value || '없음'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: 'Pretendard-Bold', fontSize: 17 },
  scroll: { paddingBottom: 32 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { marginTop: 40, textAlign: 'center', fontSize: 15, color: Colors.darkGray },
  head: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 22 },
  headRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  headMain: { flex: 1 },
  store: { fontSize: 14, color: Colors.darkGray },
  message: {
    marginTop: 4,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.7
  },
  number: { alignItems: 'flex-end' },
  numberLabel: { fontSize: 13, color: Colors.darkGray },
  numberValue: {
    marginTop: 2,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -1
  },
  band: { height: 8, backgroundColor: Colors.superUltraLightGray },
  section: { padding: 20 },
  sectionTitle: { marginBottom: 10, fontFamily: 'Pretendard-Bold', fontSize: 15 },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 7 },
  itemName: { fontSize: 15 },
  // 중첩된 rneui Text는 테마 폰트를 다시 적용하므로 폰트 지정 반복
  itemOption: { fontFamily: 'Pretendard-Medium', fontSize: 15, color: Colors.darkGray },
  total: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: Colors.superUltraLightGray
  },
  totalLabel: { fontFamily: 'Pretendard-Bold', fontSize: 15 },
  totalValue: { fontFamily: 'Pretendard-ExtraBold', fontSize: 20, letterSpacing: -0.6 },
  totalVoid: { color: Colors.gray, textDecorationLine: 'line-through' },
  info: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 5 },
  infoLabel: { fontSize: 14, color: Colors.darkGray },
  infoValue: { flexShrink: 1, fontSize: 14, textAlign: 'right' },
  infoEmpty: { color: Colors.gray },
  storeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  pressed: { backgroundColor: Colors.superUltraLightGray },
  storeLinkText: { fontFamily: 'Pretendard-SemiBold', fontSize: 15 }
});
