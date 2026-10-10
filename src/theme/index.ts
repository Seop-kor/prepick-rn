import { createTheme } from '@rneui/themed';
import Colors from './color';

const bold = { fontFamily: 'Pretendard-Bold', color: Colors.black };

export const theme = createTheme({
  mode: 'light',
  lightColors: {
    primary: Colors.primary,
    secondary: Colors.secondary,
    black: Colors.black,
    error: Colors.red,
    disabled: Colors.superUltraLightGray
  },
  components: {
    Text: {
      style: {
        fontFamily: 'Pretendard-Medium',
        fontSize: 17,
        color: Colors.black
      },
      h1Style: bold,
      h2Style: bold,
      h3Style: bold,
      h4Style: bold
    },
    Button: {
      radius: 14,
      buttonStyle: { height: 56 },
      titleStyle: { fontFamily: 'Pretendard-Bold', fontSize: 17 },
      disabledTitleStyle: { color: Colors.gray }
    }
  }
});
