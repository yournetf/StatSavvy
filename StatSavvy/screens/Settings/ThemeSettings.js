import { DBContext } from "../../App";
import { UserContext } from "../../App";

import { doc, updateDoc } from "firebase/firestore";

import { DevSettings } from "react-native";

import { useContext } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, Platform, Image, View, Button } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import {useState} from "react";

// Mapping of team logos
const teamLogos = {
    "Default": require("../../assets/StatSavvyTitle.png"),
    "Blackout": require("../../assets/StatSavvyTitle.png"),
    "Arizona Cardinals": require("../../assets/TeamLogos/arizona_cardinals_logo.png"),
    "Atlanta Falcons": require("../../assets/TeamLogos/atlanta_falcons_logo.png"),
    "Baltimore Ravens": require("../../assets/TeamLogos/baltimore_ravens_logo.png"),
    "Buffalo Bills": require("../../assets/TeamLogos/buffalo_bills_logo.png"),
    "Carolina Panthers": require("../../assets/TeamLogos/carolina_panthers_logo.png"),
    "Chicago Bears": require("../../assets/TeamLogos/chicago_bears_logo.png"),
    "Cincinnati Bengals": require("../../assets/TeamLogos/cincinnati_bengals_logo.png"),
    "Cleveland Browns": require("../../assets/TeamLogos/cleveland_browns_logo.png"),
    "Dallas Cowboys": require("../../assets/TeamLogos/dallas_cowboys_logo.png"),
    "Denver Broncos": require("../../assets/TeamLogos/denver_broncos_logo.png"),
    "Detroit Lions": require("../../assets/TeamLogos/detroit_lions_logo.png"),
    "Green Bay Packers": require("../../assets/TeamLogos/green_bay_packers_logo.png"),
    "Houston Texans": require("../../assets/TeamLogos/houston_texans_logo.png"),
    "Indianapolis Colts": require("../../assets/TeamLogos/indianapolis_colts_logo.png"),
    "Jacksonville Jaguars": require("../../assets/TeamLogos/jacksonville_jaguars_logo.png"),
    "Kansas City Chiefs": require("../../assets/TeamLogos/kansas_city_chiefs_logo.png"),
    "Las Vegas Raiders": require("../../assets/TeamLogos/las_vegas_raiders_logo.png"),
    "Los Angeles Chargers": require("../../assets/TeamLogos/los_angeles_chargers_logo.png"),
    "Los Angeles Rams": require("../../assets/TeamLogos/los_angeles_rams_logo.png"),
    "Miami Dolphins": require("../../assets/TeamLogos/miami_dolphins_logo.png"),
    "Minnesota Vikings": require("../../assets/TeamLogos/minnesota_vikings_logo.png"),
    "New England Patriots": require("../../assets/TeamLogos/new_england_patriots_logo.png"),
    "New Orleans Saints": require("../../assets/TeamLogos/new_orleans_saints_logo.png"),
    "New York Giants": require("../../assets/TeamLogos/new_york_giants_logo.png"),
    "New York Jets": require("../../assets/TeamLogos/new_york_jets_logo.png"),
    "Philadelphia Eagles": require("../../assets/TeamLogos/philadelphia_eagles_logo.png"),
    "Pittsburgh Steelers": require("../../assets/TeamLogos/pittsburgh_steelers_logo.png"),
    "San Francisco 49ers": require("../../assets/TeamLogos/san_francisco_49ers_logo.png"),
    "Seattle Seahawks": require("../../assets/TeamLogos/seattle_seahawks_logo.png"),
    "Tampa Bay Buccaneers": require("../../assets/TeamLogos/tampa_bay_buccaneers_logo.png"),
    "Tennessee Titans": require("../../assets/TeamLogos/tennessee_titans_logo.png"),
    "Washington Commanders": require("../../assets/TeamLogos/washington_commanders_logo.png"),
};



const teamData = {
    data: [
        { teamName: "Default", color1: "#101c2e", color2: "#112D4E", color3: "#70d4e1", color4: "#FFFFFF" },
        { teamName: "Blackout", color1: "#000000", color2: "#101c2e", color3: "#70d4e1", color4: "#FFFFFF" },
        { teamName: "Arizona Cardinals", color1: "#97233F", color2: "#000000", color3: "#FFB612", color4: "#FFFFFF" },
        { teamName: "Atlanta Falcons", color1: "#A71930", color2: "#000000", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "Baltimore Ravens", color1: "#241773", color2: "#A0A1A3", color3: "#FFC20E", color4: "#FFFFFF" },
        { teamName: "Buffalo Bills", color1: "#003DA5", color2: "#C60C30", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Carolina Panthers", color1: "#0085CA", color2: "#101820", color3: "#B7B9B7", color4: "#FFFFFF" },
        { teamName: "Chicago Bears", color1: "#C83803", color2: "#003B2D", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Cincinnati Bengals", color1: "#FB4F14", color2: "#000000", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Cleveland Browns", color1: "#5B3C29", color2: "#FF3D00", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Dallas Cowboys", color1: "#002A5C", color2: "#FFFFFF", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "Denver Broncos", color1: "#003c71", color2: "#e95e2d", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Detroit Lions", color1: "#0076A8", color2: "#B0B7BC", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Green Bay Packers", color1: "#002A5C", color2: "#FFB612", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Houston Texans", color1: "#A71930", color2: "#002E5D", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Indianapolis Colts", color1: "#002C5F", color2: "#A5ACAF", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Jacksonville Jaguars", color1: "#006778", color2: "#FBBF00", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "Kansas City Chiefs", color1: "#C8102E", color2: "#FFB612", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Las Vegas Raiders", color1: "#000000", color2: "#A5ACAF", color3: "#000000", color4: "#FFFFFF" },
        { teamName: "Los Angeles Chargers", color1: "#1C5B94", color2: "#FFD100", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Los Angeles Rams", color1: "#003DA5", color2: "#FFD100", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Miami Dolphins", color1: "#008E9B", color2: "#F15A29", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Minnesota Vikings", color1: "#4F2B84", color2: "#FFC62D", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "New England Patriots", color1: "#002244", color2: "#C8102E", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "New Orleans Saints", color1: "#C69C6D", color2: "#000000", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "New York Giants", color1: "#0E4C92", color2: "#A5ACAF", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "New York Jets", color1: "#006B3F", color2: "#FFFFFF", color3: "#A5ACAF", color4: "#FFFFFF" },
        { teamName: "Philadelphia Eagles", color1: "#004C54", color2: "#A5ACAF", color3: "#B4C5D7", color4: "#FFFFFF" },
        { teamName: "Pittsburgh Steelers", color1: "#FFB612", color2: "#000000", color3: "#B3B3B3", color4: "#000000" },
        { teamName: "San Francisco 49ers", color1: "#A50034", color2: "#B3996B", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Seattle Seahawks", color1: "#002C5F", color2: "#A5ACAF", color3: "#B4C5D7", color4: "#FFFFFF" },
        { teamName: "Tampa Bay Buccaneers", color1: "#D50A0A", color2: "#A7A8AA", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Tennessee Titans", color1: "#4B92DB", color2: "#C6A547", color3: "#FFFFFF", color4: "#000000" },
        { teamName: "Washington Commanders", color1: "#A6192E", color2: "#FFC20E", color3: "#FFFFFF", color4: "#000000" },
    ]
};


export default function ThemeSettings({ navigation }) {

    const user = useContext(UserContext);
    const db = useContext(DBContext);
    
    const color1 = user[1].theme[0];
    const color2 = user[1].theme[1];
    const color3 = user[1].theme[2];
    const color4 = user[1].theme[3];

    const userEmail = user[0].email;

    const userDocRef = doc(db, "UserInfo", userEmail);

    const [colorsSelected, setColorsSelected] = useState([color1, color2, color3]);

    function handleTeamSelect(item) {
        const selectedColors = [item.color1, item.color2, item.color3, item.color4];
        setColorsSelected(selectedColors);
    }
    

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colorsSelected[0]}]}>
            <View style={[styles.teamsList, {backgroundColor: colorsSelected[1]}]}>
            <FlashList
                estimatedItemSize={80}
                data={teamData.data}
                keyExtractor={(item) => item.teamName}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.teamBlock} onPress={()=>{handleTeamSelect(item)}}>
                        <Text style={[styles.teamName, {color: "cyan"}]}>{item.teamName}</Text>
                        <View style={styles.teamColorContainer}>
                            <View style={[styles.teamColorBlock, { backgroundColor: item.color1 }]} />
                            <View style={[styles.teamColorBlock, { backgroundColor: item.color2 }]} />
                            <View style={[styles.teamColorBlock, { backgroundColor: item.color3 }]} />
                        </View>
                        <Image 
                            style={styles.picture} 
                            source={teamLogos[item.teamName]} 
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            />
            <Button title="Save & Restart" style={{backgroundColor: colorsSelected[2]}} 
                onPress={async() => {
                        try{
                            await updateDoc(userDocRef, {
                                theme: colorsSelected
                            });
                            setTimeout(()=>{
                                DevSettings.reload();
                            }, 100);
                        } catch(error) {
                            console.log(error);
                            navigation.goBack();
                        }
                    }
                }
            />
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 20 : 0,
    },
    teamsList: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        left: '5%',
        top: '10%',
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    teamBlock: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamName: {
        fontSize: 18,
        fontWeight: '500',
    },
    teamColorContainer: {
        position: 'absolute',
        right: 80,
        width: 80,
        height: 40,
        backgroundColor: 'transparent',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'grey',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    teamColorBlock: {
        width: '33.3333333%',
        height: '100%',
    },
    picture: {
        position:'absolute',
        right: 0,
        width: 50,
        height: 50,
        marginRight: 0,
    },
});
