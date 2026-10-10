import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

const SIGNUP_STEPS = 4;

type Props = {
  title: string;
  subtitle?: string;
  // 회원가입 진행 단계 (1부터 시작)
  step?: number;
  button?: { title: string; onPress: () => void; isDisabled?: boolean };
  children: ReactNode;
};

export default function AuthForm({ title, subtitle, step, button, children }: Props) {
  const isKeyboardVisible = useKeyboardVisible();

  function handleBack() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.nav}>
        <Pressable
          style={styles.back}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
        >
          <View style={styles.chevron} />
        </Pressable>
        {!!step && (
          <View style={styles.progress} accessibilityLabel={`${SIGNUP_STEPS}단계 중 ${step}단계`}>
            {Array.from({ length: SIGNUP_STEPS }, (_, i) => (
              <View key={i} style={[styles.segment, i < step && styles.segmentOn]} />
            ))}
          </View>
        )}
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.form}>{children}</View>
        </ScrollView>
        {button && (
          <Button
            title={button.title}
            onPress={button.onPress}
            disabled={button.isDisabled}
            {...(isKeyboardVisible && { radius: 0 })}
            containerStyle={!isKeyboardVisible && styles.buttonFloating}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function useKeyboardVisible() {
  const [isVisible, setIsVisible] = useState(() => Keyboard.isVisible());
  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setIsVisible(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setIsVisible(false));
    // 안드로이드는 Did 이벤트만 발생
    const showAndroid = Keyboard.addListener('keyboardDidShow', () => setIsVisible(true));
    const hideAndroid = Keyboard.addListener('keyboardDidHide', () => setIsVisible(false));
    return () => [show, hide, showAndroid, hideAndroid].forEach((s) => s.remove());
  }, []);
  return isVisible;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  nav: { height: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12 },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  chevron: {
    width: 12,
    height: 12,
    marginLeft: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.black,
    transform: [{ rotate: '45deg' }]
  },
  progress: { flex: 1, flexDirection: 'row', gap: 6, marginRight: 8 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.superUltraLightGray },
  segmentOn: { backgroundColor: Colors.primary },
  body: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 },
  title: { fontFamily: 'Pretendard-Bold', fontSize: 24, lineHeight: 33, letterSpacing: -0.5 },
  subtitle: { marginTop: 8, fontSize: 15, lineHeight: 22, color: Colors.darkGray },
  form: { marginTop: 32, gap: 18 },
  buttonFloating: { marginHorizontal: 20, marginBottom: 12 }
});
