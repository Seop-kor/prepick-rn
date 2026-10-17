import { Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import Colors from '@/theme/color';

export const CODE_LENGTH = 6;

const toClock = (ms: number) => {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

type Props = {
  code: string;
  onChangeCode: (code: string) => void;
  // 재전송 중이거나 실패하면 undefined → 타이머를 숨기고 입력은 허용
  expiresAt?: number;
  retryAt?: number;
  error?: string;
  onResend: () => void;
};

export default function OtpInput({ code, onChangeCode, expiresAt, retryAt, error, onResend }: Props) {
  const [isFocused, setIsFocused] = useState(true);
  const [now, setNow] = useState(Date.now);

  // 백그라운드에 있던 시간도 반영되도록 카운터 감소 대신 시각 차이로 계산
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const expiresIn = expiresAt === undefined ? undefined : expiresAt - now;
  const retryIn = retryAt === undefined ? 0 : retryAt - now;
  const isExpired = expiresIn !== undefined && expiresIn <= 0;

  function handleChangeText(value: string) {
    onChangeCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH));
  }

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  return (
    <View>
      <View style={styles.cells}>
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <View
            key={i}
            style={[styles.cell, isFocused && !isExpired && i === code.length && styles.cellActive]}
          >
            <Text style={styles.digit}>{code[i]}</Text>
          </View>
        ))}
        {/* 칸 위에 투명 입력 하나를 덮어 붙여넣기와 iOS 문자 자동완성을 유지 */}
        <TextInput
          style={styles.hiddenInput}
          value={code}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={CODE_LENGTH}
          editable={!isExpired}
          caretHidden
          autoFocus
          accessibilityLabel="인증번호 6자리"
        />
      </View>
      <View style={styles.meta}>
        {isExpired ? (
          <Text style={styles.error}>인증 시간이 지났어요.</Text>
        ) : (
          <Text style={styles.timer}>{expiresIn !== undefined && toClock(expiresIn)}</Text>
        )}
        {retryIn > 0 && !isExpired ? (
          <Text style={styles.muted}>{toClock(retryIn)} 후 다시 받기</Text>
        ) : (
          <Text style={styles.link} onPress={onResend}>
            인증번호 다시 받기
          </Text>
        )}
      </View>
      {!!error && <Text style={[styles.error, styles.errorLine]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  cells: { flexDirection: 'row', gap: 8 },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: Colors.superUltraLightGray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellActive: { backgroundColor: Colors.white, borderColor: Colors.primary },
  digit: { fontFamily: 'Pretendard-Bold', fontSize: 28, fontVariant: ['tabular-nums'] },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: 'transparent',
    fontSize: 1
  },
  meta: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  timer: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: Colors.primary,
    fontVariant: ['tabular-nums']
  },
  muted: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: Colors.darkGray,
    fontVariant: ['tabular-nums']
  },
  error: { fontSize: 14, color: Colors.red },
  errorLine: { marginTop: 8 },
  link: { fontFamily: 'Pretendard-Bold', fontSize: 14, textDecorationLine: 'underline' }
});
