import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, type TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  lightBorderColor,
  darkBorderColor,
  lightBackgroundColor,
  darkBackgroundColor,
  placeholderTextColor,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const resolvedPlaceholderColor = useThemeColor(
    { light: lightPlaceholderColor, dark: darkPlaceholderColor },
    "mutedText"
  );
  const borderColor = useThemeColor({ light: lightBorderColor, dark: darkBorderColor }, "border");
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "background"
  );

  return (
    <TextInput
      style={[{ color, borderColor, backgroundColor }, style]}
      placeholderTextColor={placeholderTextColor ?? resolvedPlaceholderColor}
      {...rest}
    />
  );
}
