import {createContext, useContext, useEffect, useState, useMemo, useCallback} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddressContext = createContext(null);

const createAddress = ({title, houseNumber, aptNamePlot, tempAddress, formattedAddress}) => ({
    title,
    houseNumber,
    aptNamePlot,
    tempAddress,
    formattedAddress,
    id: Date.now().toString(),
});

export const AddressProvider = ({children}) => {
    const [addresses, setAddresses] = useState({
        addressArray: [],
        length: 0,
        currentAddressIndex: 0,
        isLoading: true,
    });

    useEffect(() => {
        loadAddress();
    }, []);

    const loadAddress = async () => {
        try {
            const storedAddressArray = await AsyncStorage.getItem('addressArray');
            const storedCurrentIndex = await AsyncStorage.getItem('currentAddressIndex');

            if (storedAddressArray) {
                const parsedArray = JSON.parse(storedAddressArray);
                const parsedIndex = storedCurrentIndex ? JSON.parse(storedCurrentIndex) : 0;

                setAddresses({
                    addressArray: parsedArray,
                    length: parsedArray.length,
                    currentAddressIndex: parsedIndex,
                    isLoading: false
                });
            } else {
                setAddresses((prev) => ({
                    ...prev,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Error Loading Data: ', error);
            setAddresses((prev) => ({...prev, isLoading: false}));
        }
    };

    const addAddress = useCallback(async (addressData) => {
        try {
            const newAddress = createAddress(addressData);
            const newArray = [...addresses.addressArray, newAddress];
            const newIndex = newArray.length - 1;

            setAddresses({
                addressArray: newArray,
                currentAddressIndex: newIndex,
                length: newArray.length,
                isLoading: false,
            });

            await AsyncStorage.setItem('addressArray', JSON.stringify(newArray));
            await AsyncStorage.setItem('currentAddressIndex', JSON.stringify(newIndex));
            return { success: true }
        } catch (error) {
            console.error('Error adding address: ', error);
        }
    }, [addresses.addressArray]);

    const setCurrentAddress = useCallback(async (index) => {
        try {
            if (index < 0 || index >= addresses.addressArray.length) {
                console.error('Invalid address index');
                return;
            }

            setAddresses((prev) => ({
                ...prev,
                currentAddressIndex: index
            }));

            await AsyncStorage.setItem('currentAddressIndex', JSON.stringify(index));
        } catch (error) {
            console.error('Error setting current address: ', error);
        }
    }, [addresses.addressArray.length]);

    const removeAddress = useCallback(async (index) => {
        try {
            if (index < 0 || index >= addresses.addressArray.length) {
                console.error('Invalid address index');
                return;
            }

            const newArray = addresses.addressArray.filter((_, i) => i !== index);
            let newIndex = 0;

            if (newArray.length > 0) {
                if (index === addresses.currentAddressIndex) {
                    newIndex = 0;
                } else if (index < addresses.currentAddressIndex) {
                    newIndex = addresses.currentAddressIndex - 1;
                } else {
                    newIndex = addresses.currentAddressIndex;
                }
            }

            setAddresses({
                addressArray: newArray,
                length: newArray.length,
                currentAddressIndex: newIndex,
                isLoading: false
            });

            await AsyncStorage.setItem('addressArray', JSON.stringify(newArray));
            await AsyncStorage.setItem('currentAddressIndex', JSON.stringify(newIndex));

        } catch (error) {
            console.error('Error removing address: ', error);
        }
    }, [addresses.addressArray, addresses.currentAddressIndex]);

    const value = useMemo(() => ({
        allAddresses: addresses.addressArray,
        currentAddress: addresses.addressArray[addresses.currentAddressIndex] || null,
        currentAddressIndex: addresses.currentAddressIndex,
        length: addresses.length,
        isLoading: addresses.isLoading,
        addAddress,
        removeAddress,
        setCurrentAddress,
    }), [addresses, addAddress, removeAddress, setCurrentAddress]);

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within AddressProvider');
    }
    return context;
};

export default AddressContext;