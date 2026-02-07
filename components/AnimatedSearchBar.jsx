import { useEffect, useRef, useState } from 'react';
import {
    View,
    Animated,
    StyleSheet, TouchableOpacity,
} from 'react-native';
import {SearchIcon} from "lucide-react-native";
import {router} from "expo-router";

const SUGGESTIONS = [
    'Search milk',
    'Search bread',
    'Search chicken',
    'Search eggs',
    'Search vegetables',
];

export default function AnimatedSearchBar({value, }) {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const [index, setIndex] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -20,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                translateY.setValue(20);
                setIndex((prev) => (prev + 1) % SUGGESTIONS.length);
                opacity.setValue(1);

                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push('/Search')}>
            <View style={styles.searchBox}>
                <SearchIcon size={20} color={'#64748b'}/>
                <Animated.Text
                    style={[
                        styles.placeholder,
                        {
                            transform: [{ translateY }],
                            opacity,
                        },
                    ]}
                >
                    {SUGGESTIONS[index]}
                </Animated.Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F2F2F2',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 0,
    },
    placeholder: {
        position: 'absolute',
        left: 48,
        fontSize: 16,
        color: '#888',
        pointerEvents: 'none',
    },
});