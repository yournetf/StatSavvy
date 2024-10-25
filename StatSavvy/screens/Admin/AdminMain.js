import { SafeAreaView, StyleSheet, Platform, Text, FlatList } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../App";
import { DBContext } from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function AdminMain(){

    const user = useContext(UserContext);
    const db = useContext(DBContext);

    const color1 = user[1].theme[0];
    const color2 = user[1].theme[1];
    const color3 = user[1].theme[2];
    const color4 = user[1].theme[3];

    

    const helloWorld = () =>{
        console.log("hello world");
    }

    const goodbyeWorld = () =>{
        console.log("goodbye world");
    }

    const functions = [
        { title: "hey ", function: helloWorld },
        { title: "goodbye", function: goodbyeWorld },
    ]

    return(
        <SafeAreaView style={[styles.container, {backgroundColor: color1}]}>
            <Text style={[styles.header, {color: color2}]}>Admin</Text>
            <FlatList
                style={ [styles.functionList, {backgroundColor: 'black'}] }
                data={functions}
                renderItem={({item})=>{
                    return(
                        <TouchableOpacity style={[styles.functionItem, {backgroundColor: color3}]} onPress={item.function}>
                            <Text style={[{color: color4}]}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                }}
                ItemSeparatorComponent={() => <SafeAreaView style={{ height: 20 }} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? 100 : 0,
      },
    header: {
        fontSize: 25,
        fontWeight: '700',
        top: '15%',
    },
    functionList: {
        position: 'absolute',
        width: '90%',
        height: '70%',
        left: '5%',
        top: '30%',
        padding: 10,
        borderRadius: 10,
    },
    functionItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        top: 1,
        flexDirection: 'row',
        borderRadius: 25,
    },
})