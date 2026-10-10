import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

// SignUpInput에 동의 필드가 없어 현재는 UI만 존재
const TERMS = [
  { title: '서비스 이용약관', hasDetail: true },
  { title: '개인정보 수집 및 이용', hasDetail: true },
  { title: '만 14세 이상입니다', hasDetail: false }
];

export default function TermsBottomSheet() {
  const [agreements, setAgreements] = useState(TERMS.map(() => false));
  const isAllAgreed = agreements.every(Boolean);

  function handleToggleAll() {
    setAgreements(TERMS.map(() => !isAllAgreed));
  }

  function handleToggle(index: number) {
    setAgreements(agreements.map((isAgreed, i) => (i === index ? !isAgreed : isAgreed)));
  }

  function handleOpenDetail(title: string) {
    router.push({ pathname: '/terms-detail', params: { title } });
  }

  function handleAgree() {
    router.replace('/signup');
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.title}>{'서비스 이용을 위해\n약관에 동의해주세요'}</Text>
      <Pressable
        style={styles.all}
        onPress={handleToggleAll}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isAllAgreed }}
      >
        <View style={[styles.circle, isAllAgreed && styles.circleOn]}>
          <View style={[styles.check, { borderColor: Colors.white }]} />
        </View>
        <Text style={styles.allText}>전체 동의</Text>
      </Pressable>
      {TERMS.map(({ title, hasDetail }, i) => (
        <View key={title} style={styles.termRow}>
          <Pressable
            style={styles.term}
            onPress={() => handleToggle(i)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreements[i] }}
          >
            <View
              style={[styles.check, { borderColor: agreements[i] ? Colors.primary : Colors.lightGray }]}
            />
            <Text style={styles.termText}>
              <Text style={styles.required}>필수 </Text>
              {title}
            </Text>
          </Pressable>
          {hasDetail && (
            <Pressable
              style={styles.detail}
              onPress={() => handleOpenDetail(title)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`${title} 보기`}
            >
              <View style={styles.chevron} />
            </Pressable>
          )}
        </View>
      ))}
      <Button
        title="동의하고 가입하기"
        disabled={!isAllAgreed}
        onPress={handleAgree}
        containerStyle={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 12 },
  title: { fontFamily: 'Pretendard-Bold', fontSize: 24, lineHeight: 33, letterSpacing: -0.5 },
  all: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.superUltraLightGray
  },
  allText: { fontFamily: 'Pretendard-Bold' },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ultraLightGray
  },
  circleOn: { backgroundColor: Colors.primary },
  check: {
    width: 12,
    height: 7,
    marginTop: -3,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: '-45deg' }]
  },
  termRow: { flexDirection: 'row', alignItems: 'center' },
  term: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 12,
    paddingHorizontal: 22
  },
  termText: { fontSize: 15 },
  required: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, color: Colors.primary },
  detail: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  chevron: {
    width: 9,
    height: 9,
    marginRight: 3,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.gray,
    transform: [{ rotate: '-135deg' }]
  },
  button: { marginTop: 20 }
});
