/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#17212B',
    mutedText: '#5F6B7A',
    background: '#FAFBFC',
    tint: tintColorLight,
    icon: '#687076',
    border: '#D9E0E8',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E8EDF2',
    mutedText: '#A2AFBD',
    background: '#11161B',
    tint: tintColorDark,
    icon: '#9BA1A6',
    border: '#2D3742',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
