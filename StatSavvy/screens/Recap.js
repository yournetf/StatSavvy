import { SafeAreaView, Text, StyleSheet, Platform } from "react-native";
import { useContext } from "react";
import { UserContext } from "../App";

export default function(){

    const user = useContext(UserContext);
    const color1 = user[1].theme[0];
    const color2 = user[1].theme[1];
    const color3 = user[1].theme[2];
    const color4 = user[1].theme[3];


    return(
        <SafeAreaView style={[styles.container, {backgroundColor: color1}]}>
            <Text style={{color: color3}}>Recap Screen</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 50 : 0
      },
})
