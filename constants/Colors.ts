/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    mutedText: '#687076',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    border: '#D7DCE3',
    chipBg: '#EEF2F7',
    chipActiveBg: tintColorLight,
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    mutedText: '#9BA1A6',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    border: '#3B434A',
    chipBg: '#2A333C',
    chipActiveBg: tintColorDark,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
