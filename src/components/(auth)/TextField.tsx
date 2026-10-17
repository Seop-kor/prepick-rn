import { Text } from '@rneui/themed';
import { type ReactNode, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import Colors from '@/theme/color';

type Props = TextInputProps & {
  label: string;
  hint?: string;
  success?: string;
  error?: string;
  right?: ReactNode;
};

type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];

export default function TextField({
  label,
  hint,
  success,
  error,
  right,
  onFocus,
  onBlur,
  style,
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const message = error ?? success ?? hint;

  function handleFocus(e: FocusEvent) {
    setIsFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: FocusEvent) {
    setIsFocused(false);
    onBlur?.(e);
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, isFocused && styles.focused, !!error && styles.error]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.gray}
          selectionColor={Colors.primary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {right}
      </View>
      {!!message && (
        <Text
          style={[
            styles.message,
            !!error && { color: Colors.red },
            !error && !!success && { color: Colors.green }
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: 'Pretendard-SemiBold', fontSize: 14, color: Colors.darkGray, marginBottom: 8 },
  box: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: Colors.superUltraLightGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8
  },
  focused: { backgroundColor: Colors.white, borderColor: Colors.black },
  error: { backgroundColor: Colors.white, borderColor: Colors.red },
  input: { flex: 1, height: '100%', fontFamily: 'Pretendard-Medium', fontSize: 17, color: Colors.black },
  message: { marginTop: 8, fontSize: 14, color: Colors.darkGray }
});
