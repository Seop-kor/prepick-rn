import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

export default function WelcomeScreen() {
  function handleLogin() {
    router.push('/login');
  }

  function handleSignup() {
    router.push('/terms');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.wordmark}>prepick</Text>
      <Text style={styles.headline}>
        줄 서지 말고{'\n'}미리 주문,{'\n'}
        <Text style={styles.headlineAccent}>도착하면{'\n'}바로 픽업</Text>
      </Text>
      <View>
        <Button title="휴대폰 번호로 로그인" color="black" onPress={handleLogin} />
        <Text style={styles.switch}>
          처음이신가요?{'  '}
          <Text style={styles.link} onPress={handleSignup}>
            회원가입
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  wordmark: {
    marginTop: 20,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 22,
    letterSpacing: -0.6,
    color: Colors.white
  },
  headline: {
    marginTop: 'auto',
    paddingBottom: 28,
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 58,
    lineHeight: 63,
    letterSpacing: -2.6
  },
  // 중첩된 rneui Text는 테마 폰트를 다시 적용하므로 폰트 지정 반복
  headlineAccent: {
    fontFamily: 'Pretendard-ExtraBold',
    fontSize: 58,
    letterSpacing: -2.6,
    color: Colors.white
  },
  switch: { marginTop: 18, textAlign: 'center', fontSize: 15 },
  link: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
    textDecorationLine: 'underline'
  }
});
