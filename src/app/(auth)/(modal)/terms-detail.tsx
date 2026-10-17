import { Text } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

export default function TermsDetailModal() {
  const { title } = useLocalSearchParams<{ title: string }>();

  function handleClose() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.close} onPress={handleClose} accessibilityRole="button">
          닫기
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.text}>약관 내용이 준비되면 여기에 표시돼요.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.ultraLightGray
  },
  title: { flex: 1, fontFamily: 'Pretendard-Bold', fontSize: 17 },
  close: { fontFamily: 'Pretendard-SemiBold', fontSize: 16, padding: 8, marginRight: -8 },
  body: { padding: 20 },
  text: { fontSize: 15, lineHeight: 24, color: Colors.darkGray }
});
