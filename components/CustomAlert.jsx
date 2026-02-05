import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Custom Alert Component with Cancel functionality
const CustomAlert = ({
                         visible,
                         title,
                         message,
                         onOk,
                         onCancel,
                         showCancel = false,
                         okText = 'OK',
                         cancelText = 'Cancel',
                         onClose
                     }) => {
    const handleOk = () => {
        if (onOk) {
            onOk();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}

                    <View style={styles.buttonContainer}>
                        {showCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.okButton,
                                showCancel && styles.buttonHalf
                            ]}
                            onPress={handleOk}
                        >
                            <Text style={styles.okButtonText}>{okText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    buttonHalf: {
        flex: 1,
    },
    okButton: {
        backgroundColor: '#007AFF',
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
});