import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';

const systemScheme = Appearance.getColorScheme() ?? 'light';

export const useThemeStore = create(
    persist(
        (set, get) => ({
            mode: systemScheme,
            theme: systemScheme === 'dark' ? darkTheme : lightTheme,
            _hasHydrated: false,

            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },

            toggleMode: () => {
                const next = get().mode === 'dark' ? 'light' : 'dark';
                set({
                    mode: next,
                    theme: next === 'dark' ? darkTheme : lightTheme,
                });
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                mode: state.mode,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Update theme to match the hydrated mode
                    state.theme = state.mode === 'dark' ? darkTheme : lightTheme;
                    state.setHasHydrated(true);
                }
            },
        }
    )
);