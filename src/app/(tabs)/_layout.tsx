import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import Colors from '@/theme/color';

type TabIconProps = { color: ColorValue };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: { fontFamily: 'Pretendard-SemiBold', fontSize: 11 }
      }}
    >
      <Tabs.Screen name="home" options={{ title: '홈', tabBarIcon: HomeIcon }} />
      <Tabs.Screen name="orders" options={{ title: '주문내역', tabBarIcon: OrdersIcon }} />
      <Tabs.Screen name="more" options={{ title: '더보기', tabBarIcon: MoreIcon }} />
    </Tabs>
  );
}

function HomeIcon({ color }: TabIconProps) {
  return (
    <SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} size={24} tintColor={color} />
  );
}

function OrdersIcon({ color }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: 'receipt', android: 'receipt_long', web: 'receipt_long' }}
      size={24}
      tintColor={color}
    />
  );
}

function MoreIcon({ color }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
      size={24}
      tintColor={color}
    />
  );
}
