import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import AuthForm from '@/components/(auth)/AuthForm';
import TextField from '@/components/(auth)/TextField';
import { GraphQLError } from '@/service/client';
import { useLogin } from '@/tanstack/hooks';
import Colors from '@/theme/color';
import { formatPhone, isValidPhone } from '@/utils/phone';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate: login, isPending, error, reset } = useLogin();

  const isUnauthenticated = error instanceof GraphQLError && error.code === 'UNAUTHENTICATED';

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
    reset();
  }

  function handleChangePassword(value: string) {
    setPassword(value);
    reset();
  }

  function handleTogglePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  function handleLoginError(e: Error) {
    if (e instanceof GraphQLError && e.code === 'UNAUTHENTICATED') return;
    Alert.alert('잠시 후 다시 시도해주세요.');
  }

  // 성공하면 useLogin이 토큰을 저장하고 로그인 가드가 홈으로 이동
  function handleLogin() {
    login({ phone, password }, { onError: handleLoginError });
  }

  function handleSignup() {
    router.push('/terms');
  }

  return (
    <AuthForm
      title={'휴대폰 번호와\n비밀번호를 입력해주세요'}
      button={{
        title: '로그인',
        isDisabled: !isValidPhone(phone) || !password,
        isLoading: isPending,
        onPress: handleLogin
      }}
    >
      <TextField
        label="휴대폰 번호"
        placeholder="010-0000-0000"
        value={phone}
        onChangeText={handleChangePhone}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        autoFocus
      />
      <TextField
        label="비밀번호"
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={handleChangePassword}
        secureTextEntry={!isPasswordVisible}
        textContentType="password"
        autoComplete="current-password"
        error={isUnauthenticated ? '휴대폰 번호 또는 비밀번호가 맞지 않아요.' : undefined}
        right={
          <Text style={styles.toggle} onPress={handleTogglePassword}>
            {isPasswordVisible ? '숨기기' : '보기'}
          </Text>
        }
      />
      <Text style={styles.switch}>
        아직 회원이 아니신가요?{'  '}
        <Text style={styles.link} onPress={handleSignup}>
          회원가입
        </Text>
      </Text>
    </AuthForm>
  );
}

const styles = StyleSheet.create({
  toggle: { fontFamily: 'Pretendard-SemiBold', fontSize: 14, color: Colors.darkGray },
  switch: { marginTop: 10, textAlign: 'center', fontSize: 15, color: Colors.darkGray },
  link: { fontFamily: 'Pretendard-Bold', fontSize: 15, textDecorationLine: 'underline' }
});
