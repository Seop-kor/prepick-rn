import { Text } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/theme/color';

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>더보기</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: Colors.white },
  title: { marginTop: 22, fontFamily: 'Pretendard-ExtraBold', fontSize: 28, letterSpacing: -1 }
});
