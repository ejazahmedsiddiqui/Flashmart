import { useState } from "react";

export const useAlert = () => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        onOk: null,
        onCancel: null,
        showCancel: false,
        okText: 'OK',
        cancelText: 'Cancel'
    });

    const showAlert = (title, message, options = {}) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            onOk: options.onOk || null,
            onCancel: options.onCancel || null,
            showCancel: options.showCancel || false,
            okText: options.okText || 'OK',
            cancelText: options.cancelText || 'Cancel'
        });
    };

    const hideAlert = () => {
        setAlertConfig({
            visible: false,
            title: '',
            message: '',
            onOk: null,
            onCancel: null,
            showCancel: false,
            okText: 'OK',
            cancelText: 'Cancel'
        });
    };

    return {
        alertConfig,
        showAlert,
        hideAlert
    };
};