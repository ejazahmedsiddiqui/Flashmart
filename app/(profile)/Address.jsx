import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";

const Address = () => {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
            onPress={() => router.push('/AddressSetter')}>
                <Text>
                    Change Addresses:
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
export default Address;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingTop: 5,
        paddingHorizontal: 12,
    }
})