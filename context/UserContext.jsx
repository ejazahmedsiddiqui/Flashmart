import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        phone: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Load user data from AsyncStorage on mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedPhone = await AsyncStorage.getItem("userPhone");
            const storedToken = await AsyncStorage.getItem("userToken");

            if (storedPhone && storedToken) {
                setUser({
                    phone: storedPhone,
                    token: storedToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                setUser((prev) => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setUser((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const login = async (phone, token) => {
        try {
            await AsyncStorage.setItem("userPhone", phone);
            await AsyncStorage.setItem("userToken", token);

            setUser({
                phone,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
            return { success: true, data: token }
        } catch (error) {
            console.error("Error saving user data:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userPhone");
            await AsyncStorage.removeItem("userToken");

            setUser({
                phone: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return { success: true}
        } catch (error) {
            console.error("Error clearing user data:", error);
            throw error;
        }
    };

    const updateToken = async (newToken) => {
        try {
            await AsyncStorage.setItem("userToken", newToken);
            setUser((prev) => ({ ...prev, token: newToken }));
        } catch (error) {
            console.error("Error updating token:", error);
            throw error;
        }
    };

    const value = {
        phone: user.phone,
        token: user.token,
        isAuthenticated: user.isAuthenticated,
        isLoading: user.isLoading,
        login,
        logout,
        updateToken,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserContext;