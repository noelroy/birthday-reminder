import { useAppStore } from '@/lib/store';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
	const preferredTheme = useAppStore((s) => s.themePreference);
	const systemTheme = useRNColorScheme();

	if (preferredTheme === 'system') {
		return systemTheme;
	}

	return preferredTheme;
}
