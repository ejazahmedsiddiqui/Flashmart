import React, {useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {scheduleOnRN} from "react-native-worklets";
import {Text, View} from "react-native";
import {Star} from "lucide-react-native";
const STAR_SIZE = 40;
const TOTAL_STARS = 5;

const StarRating = ({ onRatingChange }) => {
    const [rating, setRating] = useState(0);
    const containerWidth = useSharedValue(0);
    const scale = useSharedValue(1);

    const calculateRating = (x) => {
        const percent = Math.max(0, Math.min(x / containerWidth.value, 1));
        const rawRating = percent * TOTAL_STARS;
        return Math.round(rawRating * 2) / 2;
    };

    const updateRating = (newRating) => {
        setRating(newRating);
        onRatingChange && onRatingChange(newRating);
    };

    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .onUpdate((event) => {
            const newRating = calculateRating(event.x);
            scale.value = withSpring(1.1);
            updateRating(newRating); // plain call, no bridging needed
        })
        .onEnd(() => {
            scale.value = withSpring(1);
        });

    const tapGesture = Gesture.Tap()
        .runOnJS(true)
        .onEnd((event) => {
            const newRating = calculateRating(event.x);
            scale.value = withSpring(1.1);
            updateRating(newRating);
            scale.value = withSpring(1);
        });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const renderStar = (index) => {
        const full = index + 1;
        const half = index + 0.5;
        let fillPercent = 0;
        if (rating >= full) fillPercent = 1;
        else if (rating >= half) fillPercent = 0.5;

        return (
            <View key={index} style={{ width: STAR_SIZE, height: STAR_SIZE, marginHorizontal: 4 }}>
                <Star size={STAR_SIZE} color="#ccc" fill="transparent" />
                {fillPercent > 0 && (
                    <View style={{ position: 'absolute', overflow: 'hidden', width: STAR_SIZE * fillPercent, height: STAR_SIZE }}>
                        <Star size={STAR_SIZE} color="#f5a623" fill="#f5a623" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <GestureDetector gesture={composedGesture}>
                <Animated.View
                    style={[{ flexDirection: 'row' }, animatedStyle]}
                    onLayout={(e) => { containerWidth.value = e.nativeEvent.layout.width; }}
                >
                    {[...Array(TOTAL_STARS)].map((_, i) => renderStar(i))}
                </Animated.View>
            </GestureDetector>
            <Text style={{ marginTop: 8, fontSize: 15, fontWeight: '600', color: '#f5a623' }}>
                {rating > 0 ? `${rating} / 5` : 'Tap to rate'}
            </Text>
        </View>
    );
}
export default StarRating