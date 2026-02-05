import {Text, StyleSheet, View, Animated, Modal} from "react-native";
import React, {useRef, useEffect} from "react";
import {CheckCircle2} from 'lucide-react-native';

const SuccessModal = ({
                          visible,
                          onAnimationComplete,
                          title = "Success!",
                          subtitle = "Operation completed successfully",
                          IconComponent = CheckCircle2, // Custom icon component
                          iconSize = 64,
                          iconColor = "#93BD57",
                          iconBackgroundColor = "#D1FAE5",
                          progressBarColor = "#93BD57",
                          autoCloseDuration = 800, // Duration of progress bar animation in ms
                      }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const checkScaleAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset all animations
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.3);
            checkScaleAnim.setValue(0);
            progressAnim.setValue(0);

            // Start animation sequence
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start(() => {
                // Checkmark animation
                Animated.spring(checkScaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }).start(() => {
                    // Start progress bar animation
                    Animated.timing(progressAnim, {
                        toValue: 1,
                        duration: autoCloseDuration,
                        useNativeDriver: false,
                    }).start(() => {
                        // Call the completion callback
                        if (onAnimationComplete) {
                            onAnimationComplete();
                        }
                    });
                });
            });
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            opacity: fadeAnim,
                            transform: [{scale: scaleAnim}]
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.checkmarkContainer,
                            {
                                transform: [{scale: checkScaleAnim}]
                            }
                        ]}
                    >
                        <View style={[
                            styles.checkmarkCircle,
                            {
                                backgroundColor: iconBackgroundColor,
                                width: iconSize * 1.5,
                                height: iconSize * 1.5,
                                borderRadius: iconSize * 0.75,
                            }
                        ]}>
                            <IconComponent size={iconSize} color={iconColor} strokeWidth={2.5}/>
                        </View>
                    </Animated.View>

                    <Text style={styles.successTitle}>{title}</Text>
                    <Text style={styles.successSubtitle}>{subtitle}</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    backgroundColor: progressBarColor,
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default SuccessModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    checkmarkContainer: {
        marginBottom: 24,
    },
    checkmarkCircle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontFamily: 'Montserrat',
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    successSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: 15,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
});