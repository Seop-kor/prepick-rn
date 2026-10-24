import { Text } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import { ORDER_STEPS } from '@/components/(tabs)/orders/status';
import Colors from '@/theme/color';

type Props = { step: number };

export default function OrderStepper({ step }: Props) {
  const isReady = step === ORDER_STEPS.length - 1;
  const currentColor = isReady ? Colors.green : Colors.primary;

  return (
    <View style={styles.container} accessibilityLabel={`주문 진행 단계 ${ORDER_STEPS[step]}`}>
      {ORDER_STEPS.map((label, i) => {
        const isDone = i < step;
        const isCurrent = i === step;
        const isLast = i === ORDER_STEPS.length - 1;

        return (
          <View key={label} style={styles.step}>
            <View
              style={[
                styles.line,
                i === 0 && styles.lineFirst,
                isLast && styles.lineLast,
                i <= step && styles.lineDone
              ]}
            />
            <View
              style={[
                styles.dot,
                isDone && styles.dotDone,
                isCurrent && {
                  borderColor: currentColor,
                  backgroundColor: currentColor,
                  boxShadow: `0 0 0 4px ${isReady ? '#D6EEDD' : '#FFE3D2'}`
                }
              ]}
            />
            <Text style={[styles.label, isDone && styles.labelDone, isCurrent && { color: currentColor }]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginTop: 18 },
  step: { flex: 1 },
  line: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.ultraLightGray
  },
  lineFirst: { left: 4 },
  lineLast: { right: undefined, width: 4 },
  lineDone: { backgroundColor: Colors.black },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.ultraLightGray,
    backgroundColor: Colors.white
  },
  dotDone: { borderColor: Colors.black, backgroundColor: Colors.black },
  label: { marginTop: 7, fontFamily: 'Pretendard-SemiBold', fontSize: 12, color: Colors.gray },
  labelDone: { color: Colors.darkGray }
});
