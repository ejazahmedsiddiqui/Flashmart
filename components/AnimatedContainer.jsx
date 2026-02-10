import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedTheme } from '../hooks/useAnimatedTheme';

const AnimatedContainer = ({ children }) => {
    const progress = useAnimatedTheme();

    const animatedStyle = useAnimatedStyle(() => {
        // Interpolate from white (#ffffff = rgb(255,255,255)) to dark (#191919 = rgb(25,25,25))
        const colorValue = 255 - Math.round(progress.value * 230);

        return {
            backgroundColor: `rgb(${colorValue}, ${colorValue}, ${colorValue})`,
        };
    });

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

export default AnimatedContainer;