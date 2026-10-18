import { Text } from '@rneui/themed';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/theme/color';

type Props = {
  title: string;
  message?: string;
  icon?: SymbolViewProps['name'];
  button?: { title: string; onPress: () => void; isGhost?: boolean };
};

export default function SectionNotice({ title, message, icon, button }: Props) {
  return (
    <View style={styles.container}>
      {icon && <SymbolView name={icon} size={24} tintColor={Colors.primary} style={styles.icon} />}
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {button && (
        <Pressable
          style={[styles.button, button.isGhost && styles.buttonGhost]}
          onPress={button.onPress}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, button.isGhost && styles.buttonTextGhost]}>{button.title}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.superUltraLightGray
  },
  icon: { marginBottom: 8 },
  title: { fontFamily: 'Pretendard-Bold', fontSize: 17, letterSpacing: -0.4 },
  message: { marginTop: 6, fontSize: 14, lineHeight: 21, color: Colors.darkGray },
  button: {
    alignSelf: 'flex-start',
    height: 44,
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: Colors.black
  },
  buttonGhost: { borderWidth: 1, borderColor: Colors.ultraLightGray, backgroundColor: Colors.white },
  buttonText: { fontFamily: 'Pretendard-Bold', fontSize: 15, color: Colors.white },
  buttonTextGhost: { color: Colors.black }
});
