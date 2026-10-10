import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import AuthForm from '@/components/(auth)/AuthForm';
import TextField from '@/components/(auth)/TextField';
import Colors from '@/theme/color';
import { formatPhone, isValidPhone } from '@/utils/phone';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
  }

  function handleTogglePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  function handleLogin() {
    // TODO: login mutation 연동
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
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        textContentType="password"
        autoComplete="current-password"
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
