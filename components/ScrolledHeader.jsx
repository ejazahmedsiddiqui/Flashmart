import {StyleSheet, View} from "react-native";
import {useThemeStore} from "../store/themeStore";
import {useMemo} from "react";

const ScrolledHeader = () => {
    const theme = useThemeStore((s) => s.theme);
    const styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <View>

        </View>
    )
};
export default ScrolledHeader;

const createStyles = (theme) => StyleSheet.create({
    
})