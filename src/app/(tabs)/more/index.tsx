import { Text } from '@rneui/themed';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AlertModal from '@/components/AlertModal';
import { SkeletonBlock } from '@/components/Skeleton';
import { useCurrentUser, useLogout } from '@/tanstack/hooks';
import Colors from '@/theme/color';

export default function MoreScreen() {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const appVersion = Constants.expoConfig?.version;
  const { data: user, isPending } = useCurrentUser();
  const { mutate: logout } = useLogout();

  function handleOpenLogout() {
    setIsLogoutVisible(true);
  }

  function handleCancelLogout() {
    setIsLogoutVisible(false);
  }

  function handleLogout() {
    setIsLogoutVisible(false);
    logout();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>더보기</Text>
      {isPending ? (
        <SkeletonBlock width={120} height={28} style={styles.profile} />
      ) : (
        !!user && (
          <Text style={[styles.profile, styles.name]} testID="profile-name">
            {user.name}님
          </Text>
        )
      )}
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
  profile: { marginHorizontal: 20, marginBottom: 16 },
  name: { fontFamily: 'Pretendard-Bold', fontSize: 22, letterSpacing: -0.6 },
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
