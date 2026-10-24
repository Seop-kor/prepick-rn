import { Text } from '@rneui/themed';
import { format, isToday, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import groupBy from 'lodash/groupBy';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OrderRow from '@/components/(tabs)/orders/OrderRow';
import OrdersSkeleton from '@/components/(tabs)/orders/OrdersSkeleton';
import AlertModal from '@/components/AlertModal';
import { useOrders } from '@/tanstack/hooks';
import Colors from '@/theme/color';

export default function OrdersScreen() {
  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useOrders();
  const orders = data?.pages.flatMap((page) => page.items) ?? [];
  const sections = Object.entries(
    groupBy(orders, (order) => startOfDay(new Date(order.createdAt)).toISOString())
  ).map(([day, dayOrders]) => ({ title: formatDay(new Date(day)), data: dayOrders }));

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage && !isError) fetchNextPage();
  }

  function handleFindStore() {
    router.navigate('/home');
  }

  function handleRetry() {
    if (isFetchNextPageError) fetchNextPage();
    else refetch();
  }

  if (isPending) return <OrdersSkeleton />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {orders.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(order) => order.id}
          renderItem={({ item }) => <OrderRow order={item} />}
          renderSectionHeader={({ section }) => <Text style={styles.day}>{section.title}</Text>}
          ListHeaderComponent={<Text style={styles.title}>주문내역</Text>}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={styles.more} color={Colors.gray} /> : null
          }
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <>
          <Text style={styles.title}>주문내역</Text>
          <View style={styles.empty}>
            <SymbolView
              name={{ ios: 'receipt', android: 'receipt_long', web: 'receipt_long' }}
              size={40}
              tintColor={Colors.lightGray}
            />
            <Text style={styles.emptyTitle}>아직 주문한 내역이 없어요</Text>
            <Text style={styles.emptyMessage}>{'미리 주문하면 여기서\n준비 상태를 볼 수 있어요.'}</Text>
            <Pressable style={styles.emptyButton} onPress={handleFindStore} accessibilityRole="button">
              <Text style={styles.emptyButtonText}>주문할 매장 찾기</Text>
            </Pressable>
          </View>
        </>
      )}

      <AlertModal
        isVisible={isError}
        title="주문내역을 불러오지 못했어요"
        message="네트워크 연결을 확인하고 다시 시도해주세요."
        buttonTitle="다시 시도"
        isLoading={isFetching}
        onClose={handleRetry}
      />
    </SafeAreaView>
  );
}

function formatDay(date: Date) {
  return isToday(date) ? '오늘' : format(date, 'M월 d일 EEEE', { locale: ko });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  list: { paddingBottom: 28 },
  more: { paddingVertical: 16 },
  title: {
    marginTop: 22,
    marginBottom: 4,
    paddingHorizontal: 20,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 28,
    letterSpacing: -1
  },
  day: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 13,
    color: Colors.darkGray
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60
  },
  emptyTitle: { marginTop: 14, fontFamily: 'Pretendard-Bold', fontSize: 18, letterSpacing: -0.4 },
  emptyMessage: { marginTop: 6, fontSize: 14, lineHeight: 21, textAlign: 'center', color: Colors.darkGray },
  emptyButton: {
    height: 44,
    marginTop: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.ultraLightGray
  },
  emptyButtonText: { fontFamily: 'Pretendard-Bold', fontSize: 15 }
});
