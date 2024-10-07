import { StyleSheet, Platform, View, Text, Image} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const settings = [{
    name: "Tyreek Hill",
    data: [ 
        { icon: 'user-cog', key: 'Account & Settings', value: "" },
        { icon: 'star', key: 'Favorite Team', value: "" }, 
        { icon: 'user-friends', key: 'Invite Friends', value: "" },
        { icon: 'bell', key: 'Notifications', value: "" },
        { icon: 'paint-roller', key: 'Themes', value: "" }, 
    ]
  }];

export default function Settings({ navigation }){
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.accountHeader}>
                <Image
                    source={{ uri: 'https://picsum.photos/50/50' }}
                    style={styles.accountImage}
                />
                <View style={styles.accountUsernameView}>
                    <Text style={styles.accountUsername}>@AccountUsername</Text>
                    <Ionicons name="checkmark-circle" size={32} color="cyan" style={{top: 5, paddingLeft: 5}} />
                </View>
            </View>
            <FlatList
                style={styles.settingsList}
                data={settings[0].data}
                renderItem={({ item, index }) => (
                    <View style={styles.settingBlock}>
                        {/* Checks if item is the first in the list */}
                        {index === 0 ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AccountSettings')}
                                style={[styles.settingItem1st, styles.settingItem]}
                            >
                                <FontAwesome5 name={item.icon} color="cyan" size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        ) : index === settings[0].data.length - 1 ? (
                            /* Checks if item is the last in the list */
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ThemeSettings')}
                                style={[styles.settingItemLast, styles.settingItem]}
                            >
                                <FontAwesome5 name={item.icon} color="cyan" size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        ) : (
                            /* Items in the middle of the list */
                            <TouchableOpacity style={[styles.settingItemMiddle, styles.settingItem]}>
                                <FontAwesome5 name={item.icon} color="cyan" size={24} />
                                <Text style={styles.settingText}>{item.key} </Text>
                                <Text style={styles.settingValue}>{item.value}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <LottieView 
                source={require('../assets/SwitchAnimation.json')}
                autoPlay
                loop
                style={styles.switch}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101c2e',
        paddingTop: Platform.OS === "android" ? 20 : 0
    },
    accountHeader: {
        height: '20%',
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    accountImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    accountUsernameView:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountUsername: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
        top: 5,
    },
    settingsList: {
        position: 'absolute',
        width: '90%',
        height: '70%',
        left: '5%',
        top: '30%',
        backgroundColor: '#112D4E',
        padding: 10,
        borderRadius: 10,
    },
    settingText: {
        color: 'white',
        fontSize: 18,
        left: 10
    },
    settingItem: {
        alignItems: 'center',
        height: 50,
        paddingLeft: 5,
        backgroundColor: '#376499',
        top: 1,
        flexDirection: 'row',
    },
    settingItem1st: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    settingItemMiddle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,   
    },
    settingItemLast: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    switch: {
        width: 50,
        height: 50,
    }
});