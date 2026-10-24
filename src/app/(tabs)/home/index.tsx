import { Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartBar from '@/components/(tabs)/home/CartBar';
import HomeSkeleton from '@/components/(tabs)/home/HomeSkeleton';
import LiveOrderBar from '@/components/(tabs)/home/LiveOrderBar';
import { MOCK_HOME } from '@/components/(tabs)/home/mock';
import NewStoreCard from '@/components/(tabs)/home/NewStoreCard';
import PromotionCarousel from '@/components/(tabs)/home/PromotionCarousel';
import SectionHeader from '@/components/(tabs)/home/SectionHeader';
import SectionNotice from '@/components/(tabs)/home/SectionNotice';
import StoreRow from '@/components/(tabs)/home/StoreRow';
import { MOCK_ORDERS } from '@/components/(tabs)/orders/mock';
import { isLiveOrder } from '@/components/(tabs)/orders/status';
import AlertModal from '@/components/AlertModal';
import Colors from '@/theme/color';

// 인사말이 가려지는 지점
const COMPACT_HEADER_OFFSET = 110;

const SEARCH_ICON = { ios: 'magnifyingglass', android: 'search', web: 'search' } as const;
const CHEVRON_DOWN_ICON = {
  ios: 'chevron.down',
  android: 'keyboard_arrow_down',
  web: 'keyboard_arrow_down'
} as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isCompactHeaderVisible, setIsCompactHeaderVisible] = useState(false);
  // TODO: API 연결 시 쿼리 결과와 expo-location으로 교체
  const { isLoading, isError, isLocationGranted, locationName, user, promotions, stores, newStores, cart } =
    MOCK_HOME;
  const liveOrders = MOCK_ORDERS.filter(isLiveOrder);
  const floatingBarCount = Number(!!cart) + Number(liveOrders.length > 0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setIsCompactHeaderVisible(e.nativeEvent.contentOffset.y > COMPACT_HEADER_OFFSET);
  }

  function handleSearch() {
    // TODO: 검색 화면 작업 시 이동
  }

  function handleOpenSettings() {
    Linking.openSettings();
  }

  function handleRetry() {
    // TODO: API 연결 시 실패한 쿼리만 refetch
  }

  if (isLoading) return <HomeSkeleton />;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 32 + floatingBarCount * 72 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.hello}>
          <Text style={styles.helloName}>{`${user.name}님, 안녕하세요`}</Text>
          {isLocationGranted ? (
            <View style={styles.headline}>
              <View style={styles.headlineRow}>
                <View style={styles.location}>
                  <Text style={[styles.headlineText, styles.locationText]}>{locationName}</Text>
                  <SymbolView name={CHEVRON_DOWN_ICON} size={18} tintColor={Colors.primary} />
                </View>
                <Text style={styles.headlineText}> 근처에서</Text>
              </View>
              <Text style={styles.headlineText}>미리 주문해볼까요?</Text>
            </View>
          ) : (
            <Text style={[styles.headline, styles.headlineText]}>
              {'어디서 주문할지\n검색해서 찾아볼까요?'}
            </Text>
          )}
        </View>

        <Pressable style={styles.search} onPress={handleSearch} accessibilityRole="search">
          <SymbolView name={SEARCH_ICON} size={20} tintColor={Colors.gray} />
          <Text style={styles.searchText}>매장이나 메뉴를 검색해보세요</Text>
        </Pressable>

        {promotions.length > 0 && (
          <View style={styles.promotions}>
            <PromotionCarousel promotions={promotions} />
          </View>
        )}

        {isLocationGranted ? (
          <View style={styles.section}>
            <SectionHeader title="가까운 매장" hasMore={stores.length > 0} />
            {stores.length > 0 ? (
              <View style={styles.rows}>
                {stores.map((store) => (
                  <StoreRow key={store.id} store={store} />
                ))}
              </View>
            ) : (
              <SectionNotice
                title="주변 5km 안에 주문 가능한 매장이 없어요"
                message="매장 이름이나 메뉴로 검색하면 더 먼 매장도 찾을 수 있어요."
                button={{ title: '검색하기', onPress: handleSearch, isGhost: true }}
              />
            )}
          </View>
        ) : (
          <SectionNotice
            icon={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
            title="위치 권한이 꺼져 있어요"
            message="권한을 켜면 가까운 매장과 도보 시간을 보여드려요."
            button={{ title: '설정에서 켜기', onPress: handleOpenSettings }}
          />
        )}

        {newStores.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="새로 들어왔어요" hasMore />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cards}
            >
              {newStores.map((store) => (
                <NewStoreCard key={store.id} store={store} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {isCompactHeaderVisible && (
        <Animated.View
          style={[styles.compactHeader, { paddingTop: insets.top }]}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
        >
          <View style={styles.location}>
            <Text style={styles.compactLocation}>{isLocationGranted ? locationName : '홈'}</Text>
            {isLocationGranted && <SymbolView name={CHEVRON_DOWN_ICON} size={14} tintColor={Colors.black} />}
          </View>
          <Pressable
            style={styles.iconButton}
            onPress={handleSearch}
            accessibilityRole="button"
            accessibilityLabel="검색"
          >
            <SymbolView name={SEARCH_ICON} size={20} tintColor={Colors.black} />
          </Pressable>
        </Animated.View>
      )}

      {liveOrders.length > 0 && <LiveOrderBar orders={liveOrders} bottom={cart ? 84 : 12} />}
      {cart && <CartBar store={cart.store} itemCount={cart.itemCount} totalPrice={cart.totalPrice} />}

      <AlertModal
        isVisible={isError}
        title="정보를 불러오지 못했어요"
        message="네트워크 연결을 확인하고 다시 시도해주세요."
        buttonTitle="다시 시도"
        onClose={handleRetry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  hello: { paddingHorizontal: 20, paddingTop: 22 },
  helloName: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, color: Colors.darkGray },
  headline: { marginTop: 6 },
  headlineRow: { flexDirection: 'row', alignItems: 'center' },
  headlineText: { fontFamily: 'Pretendard-ExtraBold', fontSize: 28, lineHeight: 37, letterSpacing: -1 },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderBottomWidth: 2.5,
    borderColor: Colors.primary
  },
  locationText: { lineHeight: 32, color: Colors.primary },
  search: {
    height: 50,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: Colors.superUltraLightGray
  },
  searchText: { fontSize: 16, color: Colors.gray },
  promotions: { marginTop: 24 },
  section: { marginTop: 36 },
  rows: { marginTop: 8 },
  cards: { gap: 12, paddingHorizontal: 20, paddingTop: 14 },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.ultraLightGray
  },
  compactLocation: { fontFamily: 'Pretendard-Bold', fontSize: 17 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -10 }
});
