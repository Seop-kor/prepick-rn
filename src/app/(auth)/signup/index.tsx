import { router, Stack } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useState } from 'react';

import AuthForm from '@/components/(auth)/AuthForm';
import OtpInput, { CODE_LENGTH } from '@/components/(auth)/signup/OtpInput';
import SignupDone from '@/components/(auth)/signup/SignupDone';
import TextField from '@/components/(auth)/TextField';
import { formatPhone, isValidPhone } from '@/utils/phone';

const STEPS = ['name', 'phone', 'otp', 'password', 'done'] as const;
type Step = (typeof STEPS)[number];

// 서버 규칙: 최소 8자(코드포인트), 최대 72바이트(UTF-8, bcrypt 상한)
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;

export default function SignupScreen() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentAt, setSentAt] = useState(0);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const stepIndex = STEPS.indexOf(step);

  function handleStepBack() {
    setStep(STEPS[stepIndex - 1]);
  }

  // 뒤로 가기(헤더, iOS 스와이프, 안드로이드)를 회원가입 이탈 대신 이전 단계로 처리
  usePreventRemove(stepIndex > 0 && step !== 'done', handleStepBack);

  function handleSubmitName() {
    setStep('phone');
  }

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
  }

  function handleResendCode() {
    // TODO: sendSignupOtp 연동, 중복 번호면 "이미 가입된 번호예요." 표시
    setCode('');
    setSentAt(Date.now());
  }

  function handleRequestCode() {
    handleResendCode();
    setStep('otp');
  }

  function handleChangeCode(next: string) {
    setCode(next);
    // TODO: verifySignupOtp 연동, verificationToken 보관
    if (next.length === CODE_LENGTH) setStep('password');
  }

  function handleSignup() {
    // TODO: signUp 연동 (name, password, verificationToken)
    setStep('done');
  }

  function handleStart() {
    // TODO: signUp 토큰 저장 → 로그인 가드가 홈으로 이동
    router.dismissAll();
  }

  if (step === 'done') {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <SignupDone name={name.trim()} onStart={handleStart} />
      </>
    );
  }

  if (step === 'name') {
    return (
      <AuthForm
        title="이름을 알려주세요"
        step={1}
        button={{ title: '다음', isDisabled: !name.trim(), onPress: handleSubmitName }}
      >
        <TextField
          key="name"
          label="이름"
          placeholder="홍길동"
          value={name}
          onChangeText={setName}
          textContentType="name"
          autoComplete="name"
          autoFocus
        />
      </AuthForm>
    );
  }

  if (step === 'phone') {
    return (
      <AuthForm
        title="휴대폰 번호를 입력해주세요"
        subtitle="로그인할 때 아이디로 쓰여요."
        step={2}
        button={{ title: '인증번호 받기', isDisabled: !isValidPhone(phone), onPress: handleRequestCode }}
      >
        <TextField
          key="phone"
          label="휴대폰 번호"
          placeholder="010-0000-0000"
          value={phone}
          onChangeText={handleChangePhone}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoFocus
        />
      </AuthForm>
    );
  }

  if (step === 'otp') {
    return (
      <AuthForm title={'문자로 받은\n인증번호 6자리를 입력해주세요'} subtitle={phone} step={3}>
        <OtpInput code={code} onChangeCode={handleChangeCode} sentAt={sentAt} onResend={handleResendCode} />
      </AuthForm>
    );
  }

  const passwordLength = Array.from(password).length;
  const isTooLong = new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES;
  const isValidPassword = passwordLength >= MIN_PASSWORD_LENGTH && !isTooLong;
  const isMatched = !!confirm && confirm === password;
  // 확인 칸이 비밀번호 길이에 도달하기 전에는 불일치 문구를 띄우지 않음
  const isMismatched = !!confirm && !isMatched && Array.from(confirm).length >= passwordLength;

  return (
    <AuthForm
      title="비밀번호를 정해주세요"
      step={4}
      button={{ title: '가입하기', isDisabled: !isValidPassword || !isMatched, onPress: handleSignup }}
    >
      <TextField
        key="password"
        label="비밀번호"
        placeholder="8자 이상"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        hint={`${MIN_PASSWORD_LENGTH}자 이상 입력해주세요`}
        error={isTooLong ? '비밀번호가 너무 길어요. 조금 줄여주세요.' : undefined}
        autoFocus
      />
      <TextField
        key="confirm"
        label="비밀번호 확인"
        placeholder="한 번 더 입력"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        success={isValidPassword && isMatched ? '비밀번호가 일치해요' : undefined}
        error={isMismatched ? '비밀번호가 서로 달라요.' : undefined}
      />
    </AuthForm>
  );
}
