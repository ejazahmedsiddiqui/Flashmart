import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Text} from "react-native";

const Search = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Search page</Text>
        </SafeAreaView>
    )
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
        padding: 20
    }
})