import { Stack } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useState } from 'react';

import AuthForm from '@/components/(auth)/AuthForm';
import OtpInput, { CODE_LENGTH } from '@/components/(auth)/signup/OtpInput';
import SignupDone from '@/components/(auth)/signup/SignupDone';
import TextField from '@/components/(auth)/TextField';
import AlertModal from '@/components/AlertModal';
import { GraphQLError } from '@/service/client';
import { setTokens } from '@/stores/auth';
import { useSendSignupOtp, useSignUp, useVerifySignupOtp } from '@/tanstack/hooks';
import { formatPhone, isValidPhone } from '@/utils/phone';

const STEPS = ['name', 'phone', 'otp', 'password', 'done'] as const;
type Step = (typeof STEPS)[number];

// 서버 규칙: 최소 8자(코드포인트), 최대 72바이트(UTF-8, bcrypt 상한)
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;
const MAX_NAME_LENGTH = 50;

const ALREADY_REGISTERED_MESSAGE = '이미 가입된 번호예요.';

function getErrorCode(error: Error | null) {
  return error instanceof GraphQLError ? error.code : undefined;
}

function getOtpRequestErrorMessage(error: Error | null) {
  if (!(error instanceof GraphQLError)) return undefined;
  if (error.code === 'PHONE_NUMBER_ALREADY_REGISTERED') return ALREADY_REGISTERED_MESSAGE;
  if (error.code !== 'TOO_MANY_REQUESTS') return undefined;
  const retryAfterSeconds = error.errors[0].extensions?.retryAfterSeconds;
  return retryAfterSeconds
    ? `${retryAfterSeconds}초 후에 다시 요청해주세요.`
    : '요청 횟수를 초과했어요. 잠시 후 다시 시도해주세요.';
}

const RETRY_ALERT = { title: '요청을 처리하지 못했어요', message: '잠시 후 다시 시도해주세요.' };
const EXPIRED_ALERT = { title: '인증이 만료됐어요', message: '휴대폰 번호를 다시 인증해주세요.' };

export default function SignupScreen() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const sendOtp = useSendSignupOtp();
  const verifyOtp = useVerifySignupOtp();
  const signUp = useSignUp();
  const [alert, setAlert] = useState(RETRY_ALERT);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  function openAlert(next: typeof RETRY_ALERT) {
    setAlert(next);
    setIsAlertVisible(true);
  }

  function handleCloseAlert() {
    setIsAlertVisible(false);
  }

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
    sendOtp.reset();
    signUp.reset();
  }

  function handleSendOtpError(e: Error) {
    if (!getOtpRequestErrorMessage(e)) openAlert(RETRY_ALERT);
  }

  function handleSendOtpSuccess() {
    setCode('');
    setStep('otp');
  }

  function handleRequestCode() {
    sendOtp.mutate({ phone }, { onSuccess: handleSendOtpSuccess, onError: handleSendOtpError });
  }

  function handleResendCode() {
    if (sendOtp.isPending) return;
    setCode('');
    verifyOtp.reset();
    sendOtp.mutate({ phone }, { onError: handleSendOtpError });
  }

  function handleVerifyOtpSuccess() {
    setStep('password');
  }

  function handleVerifyOtpError(e: Error) {
    if (getErrorCode(e) !== 'BAD_USER_INPUT') openAlert(RETRY_ALERT);
  }

  function handleChangeCode(next: string) {
    setCode(next);
    verifyOtp.reset();
    if (next.length !== CODE_LENGTH) return;
    verifyOtp.mutate(
      { phone, code: next },
      { onSuccess: handleVerifyOtpSuccess, onError: handleVerifyOtpError }
    );
  }

  function handleSignupSuccess() {
    setStep('done');
  }

  function handleSignupError(e: Error) {
    if (getErrorCode(e) === 'PHONE_NUMBER_ALREADY_REGISTERED') {
      setStep('phone');
      return;
    }
    if (e.message === 'Invalid verification token') {
      openAlert(EXPIRED_ALERT);
      setStep('phone');
      return;
    }
    openAlert(RETRY_ALERT);
  }

  function handleSignup() {
    if (!verifyOtp.data) return;
    signUp.mutate(
      { name: name.trim(), password, verificationToken: verifyOtp.data.verificationToken },
      { onSuccess: handleSignupSuccess, onError: handleSignupError }
    );
  }

  // signUp 직후 저장하면 로그인 가드가 바로 바뀌어 완료 화면이 뜨기 전에 auth 스택이 사라짐
  function handleStart() {
    if (signUp.data) setTokens(signUp.data);
  }

  const alertModal = <AlertModal isVisible={isAlertVisible} {...alert} onClose={handleCloseAlert} />;

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
          maxLength={MAX_NAME_LENGTH}
          textContentType="name"
          autoComplete="name"
          autoFocus
        />
      </AuthForm>
    );
  }

  if (step === 'phone') {
    return (
      <>
        <AuthForm
          title="휴대폰 번호를 입력해주세요"
          subtitle="로그인할 때 아이디로 쓰여요."
          step={2}
          button={{
            title: '인증번호 받기',
            isDisabled: !isValidPhone(phone),
            isLoading: sendOtp.isPending,
            onPress: handleRequestCode
          }}
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
            error={
              getOtpRequestErrorMessage(sendOtp.error) ??
              (getErrorCode(signUp.error) === 'PHONE_NUMBER_ALREADY_REGISTERED'
                ? ALREADY_REGISTERED_MESSAGE
                : undefined)
            }
            autoFocus
          />
        </AuthForm>
        {alertModal}
      </>
    );
  }

  if (step === 'otp') {
    const otp = sendOtp.data;
    const isInvalidCode = getErrorCode(verifyOtp.error) === 'BAD_USER_INPUT';
    return (
      <>
        <AuthForm title={'문자로 받은\n인증번호 6자리를 입력해주세요'} subtitle={phone} step={3}>
          <OtpInput
            code={code}
            onChangeCode={handleChangeCode}
            expiresAt={otp && Date.parse(otp.expiresAt)}
            retryAt={otp && sendOtp.submittedAt + otp.retryAfterSeconds * 1000}
            error={
              isInvalidCode
                ? '인증번호가 올바르지 않아요. 계속 실패하면 다시 받아주세요.'
                : getOtpRequestErrorMessage(sendOtp.error)
            }
            onResend={handleResendCode}
          />
        </AuthForm>
        {alertModal}
      </>
    );
  }

  const passwordLength = Array.from(password).length;
  const isTooLong = new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES;
  const isValidPassword = passwordLength >= MIN_PASSWORD_LENGTH && !isTooLong;
  const isMatched = !!confirm && confirm === password;
  // 확인 칸이 비밀번호 길이에 도달하기 전에는 불일치 문구를 띄우지 않음
  const isMismatched = !!confirm && !isMatched && Array.from(confirm).length >= passwordLength;

  return (
    <>
      <AuthForm
        title="비밀번호를 정해주세요"
        step={4}
        button={{
          title: '가입하기',
          isDisabled: !isValidPassword || !isMatched,
          isLoading: signUp.isPending,
          onPress: handleSignup
        }}
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
      {alertModal}
    </>
  );
}
