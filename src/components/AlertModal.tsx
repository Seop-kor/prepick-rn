import { Button, Text } from '@rneui/themed';
import { useEffect } from 'react';
import { Keyboard, Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FullWindowOverlay } from 'react-native-screens';

import Colors from '@/theme/color';

type Props = {
  isVisible: boolean;
  title: string;
  message?: string;
  buttonTitle?: string;
  isLoading?: boolean;
  onClose: () => void;
};

export default function AlertModal({
  isVisible,
  title,
  message,
  buttonTitle = '확인',
  isLoading,
  onClose
}: Props) {
  // 키보드가 모달을 가리지 않도록 내린다
  useEffect(() => {
    if (isVisible) Keyboard.dismiss();
  }, [isVisible]);

  const content = (
    <View style={styles.card} accessibilityRole="alert">
      <View>
        <Text style={styles.title}>{title}</Text>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
      <Button title={buttonTitle} loading={isLoading} onPress={onClose} />
    </View>
  );

  // iOS Modal은 이미 다른 화면(formSheet 등)을 present 중이면 뜨지 않아 별도 window에 그린다
  if (process.env.EXPO_OS === 'ios') {
    if (!isVisible) return null;
    return (
      <FullWindowOverlay unstable_accessibilityContainerViewIsModal>
        <Animated.View style={styles.backdrop} entering={FadeIn.duration(150)}>
          {content}
        </Animated.View>
      </FullWindowOverlay>
    );
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>{content}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(37, 37, 37, 0.48)'
  },
  card: {
    minHeight: 200,
    justifyContent: 'space-between',
    gap: 24,
    padding: 20,
    paddingTop: 28,
    borderRadius: 16,
    backgroundColor: Colors.white
  },
  title: { fontFamily: 'Pretendard-Bold', fontSize: 19, lineHeight: 27, letterSpacing: -0.4 },
  message: { marginTop: 6, fontSize: 15, lineHeight: 22, color: Colors.darkGray }
});
