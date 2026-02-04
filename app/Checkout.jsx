import {SafeAreaView} from "react-native-safe-area-context";
import {Text, StyleSheet} from "react-native";

const Checkout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>
                Checkout
            </Text>
        </SafeAreaView>
    )
};

export default Checkout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})