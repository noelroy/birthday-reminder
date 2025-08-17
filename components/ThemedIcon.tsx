
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

export type ThemedIconProps = ComponentProps<typeof Ionicons> & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedIcon({ lightColor, darkColor, ...otherProps }: ThemedIconProps) {
    const iconColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon');

    return <Ionicons color={iconColor} {...otherProps} />;
}
