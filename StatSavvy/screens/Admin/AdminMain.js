import { SafeAreaView, StyleSheet, Platform, Text, FlatList } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../App";
import { DBContext } from "../../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import {SPORTSRADAR_API_KEY } from '@env';
import { collection, getDocs } from "firebase/firestore";

export default function AdminMain(){

    //Imports user information and firestore database from the app 
    const user = useContext(UserContext);
    const db = useContext(DBContext);

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

    //Function that is formmtted to load API data into player db.
    const loadCardinalsPlayers = async () =>{
        try {
            const response = await fetch(
                `https://api.sportradar.com/nfl/official/trial/v7/en/seasons/2024/REG/teams/de760528-1dc0-416a-a978-b510d20692ff/statistics.json?api_key=
              ${SPORTSRADAR_API_KEY}`
                , options);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const players = data.players;
            const playersAry = [];
            players.forEach((player)=>{
              playersAry.push(player.name);
            });
            console.log(playersAry);
            // await db.collection("LeagueInfo").doc("Arizona Cardinals").update({
            //   roster: playersAry,
            // });
          } catch (err) {
            console.error("Fetch error:", err);
          }
    }

    // Function to print all documents in a collection
    const printAllDocuments = async () => {
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
    

    const functions = [
        { title: "hey", function: helloWorld },
        { title: "goodbye", function: goodbyeWorld },
        { title: "make a call to xyz", function: helloWorld },
        { title: "load Cardinals players", function: loadCardinalsPlayers},
        { title: "Print all players", function: printAllDocuments},
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