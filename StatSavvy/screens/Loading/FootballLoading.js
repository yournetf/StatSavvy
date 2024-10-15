import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-navigation";
import { StyleSheet, Platform } from "react-native";

export default function FootballLoading(){
    return(
        <SafeAreaView style={styles.container}>
        <LottieView
            source={require("../../assets/FootballAnimation.json")}
            autoPlay
            loop
            style={styles.animation}
        />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101c2e',
        paddingTop: Platform.OS === "android" ? 0 : 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        height: 400,
        width: 400
    }
});