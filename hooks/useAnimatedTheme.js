import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useThemeStore } from '../store/themeStore';

export const useAnimatedTheme = () => {
    const mode = useThemeStore((s) => s.mode);
    const progress = useSharedValue(mode === 'dark' ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(mode === 'dark' ? 1 : 0, {
            duration: 180,
        });
    }, [mode]);

    return progress;
};