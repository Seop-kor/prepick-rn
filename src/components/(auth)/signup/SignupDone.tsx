import { Button, Text } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

type Props = { name: string; onStart: () => void };

export default function SignupDone({ name, onStart }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Animated.View style={styles.badgeInner} entering={ZoomIn.springify().delay(200)}>
            <View style={styles.check} />
          </Animated.View>
        </View>
        <Text style={styles.title}>{`${name}님,\n가입을 환영해요`}</Text>
        <Text style={styles.subtitle}>이제 주변 매장에서 미리 주문할 수 있어요.</Text>
      </View>
      <Button title="시작하기" onPress={onStart} containerStyle={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.primary}1F`
  },
  badgeInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary
  },
  check: {
    width: 20,
    height: 11,
    marginTop: -4,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.white,
    transform: [{ rotate: '-45deg' }]
  },
  title: { marginTop: 24, fontFamily: 'Pretendard-Bold', fontSize: 26, lineHeight: 36, letterSpacing: -0.5 },
  subtitle: { marginTop: 8, fontSize: 15, color: Colors.darkGray },
  button: { marginHorizontal: 20, marginBottom: 12 }
});
