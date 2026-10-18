import { Text } from '@rneui/themed';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import Colors from '@/theme/color';

type Props = { title: string; hasMore?: boolean };

export default function SectionHeader({ title, hasMore }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {hasMore && (
        <View style={styles.more}>
          <Text style={styles.moreText}>전체보기</Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={12}
            tintColor={Colors.darkGray}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  title: { fontFamily: 'Pretendard-ExtraBold', fontSize: 20, letterSpacing: -0.6 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreText: { fontSize: 14, color: Colors.darkGray }
});
