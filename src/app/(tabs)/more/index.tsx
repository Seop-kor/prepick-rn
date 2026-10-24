import { Text } from '@rneui/themed';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AlertModal from '@/components/AlertModal';
import Colors from '@/theme/color';

export default function MoreScreen() {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const appVersion = Constants.expoConfig?.version;

  function handleOpenLogout() {
    setIsLogoutVisible(true);
  }

  function handleCancelLogout() {
    setIsLogoutVisible(false);
  }

  function handleLogout() {
    // TODO: 로그아웃 API 연결
    setIsLogoutVisible(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>더보기</Text>
      <View style={styles.row}>
        <Text style={styles.label}>앱 버전</Text>
        <Text style={styles.value}>{appVersion}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        onPress={handleOpenLogout}
        accessibilityRole="button"
      >
        <Text style={styles.label}>로그아웃</Text>
      </Pressable>

      <AlertModal
        isVisible={isLogoutVisible}
        title="로그아웃할까요?"
        message="다시 주문하려면 로그인해야 해요."
        buttonTitle="로그아웃"
        onClose={handleLogout}
        onCancel={handleCancelLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  title: {
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 20,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 28,
    letterSpacing: -1
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  pressed: { backgroundColor: Colors.superUltraLightGray },
  label: { fontFamily: 'Pretendard-SemiBold', fontSize: 16, letterSpacing: -0.4 },
  value: { fontSize: 15, color: Colors.darkGray }
});
