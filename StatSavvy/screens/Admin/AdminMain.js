import { SafeAreaView, StyleSheet, Platform, Text, FlatList } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../App";
import { SQLiteDBContext } from "../../App";
import { DBContext } from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import {SPORTSRADAR_API_KEY } from '@env';
import { collection, getDocs } from "firebase/firestore";

export default function AdminMain(){

    //Imports user information and firestore database from the app 
    const user = useContext(UserContext);
    const db = useContext(DBContext);
    const SQLiteDB = useContext(SQLiteDBContext)

    //Gets color theme from the user context.
    const color1 = user[1].theme[0];
    const color2 = user[1].theme[1];
    const color3 = user[1].theme[2];
    const color4 = user[1].theme[3];

    //Options for the API call.
    const options = {method: "GET", headers: {accept: "application/json"}};

    //method 1.
    const helloWorld = () =>{
        console.log("hello world");
    }

    //method 2.
    const goodbyeWorld = () =>{
        console.log("goodbye world");
    }

    // Function to print all documents in a collection
    const printFirebasePlayers = async () => {
        try {
        // Get a reference to the collection
        const querySnapshot = await getDocs(collection(db, "players"));
        
        // Loop through each document in the collection and print it
        querySnapshot.forEach(doc => {
            console.log(`Document ID: ${doc.id}\n, Data:`, doc.data());
            console.log(`--------------------------------------------------`)
        });
        } catch (error) {
        console.error("Error fetching documents: ", error);
        }
    }

    const printSQLiteDBPlayers = async () =>{
        const allRowsPlayers = await SQLiteDB.getAllAsync('SELECT * FROM players');
        for(const player of allRowsPlayers) {
          console.log(player.playerID, player.name, player.team, player.number, player.age, player.position);
        }
    } 
    
    const printSQLiteDBPlayersG = async () =>{
        const allRowsPlayers = await SQLiteDB.getAllAsync('SELECT * FROM players');
        for(const player of allRowsPlayers) {
          if(player.name.charAt(0) === 'G'){
            console.log(player);
          }
        }
    }
    

    const functions = [
        { title: "hey", function: helloWorld },
        { title: "goodbye", function: goodbyeWorld },
        { title: "Print Players in Firebase", function: printFirebasePlayers},
        { title: "Print Players in SQLiteDB", function: printSQLiteDBPlayers },
        { title: "Print Players with Name G", function: printSQLiteDBPlayersG },
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