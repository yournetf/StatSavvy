import { StyleSheet, Platform, View, Text} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';

const settings = [{
    name: "Tyreek Hill",
    data: [ 
      { key: 'Targets🎯', value: "8.3" },
      { key: 'Yards💨', value: "81.3" }, 
      { key: 'Touchdowns🏈', value: "0.8" },
      { key: 'aDOT🕳', value: "15.8" },
      { key: 'YPRR📬', value: "2.18" }, 
      { key: 'Fantasy PPG🚀', value: "18.4"}
    ]
  }];

export default function Settings(){
    return(
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.settingsList}
                data={settings[0].data}
                renderItem={({ item, index }) => (
                    <View style={styles.settingBlock}>
                        {/* Checks to see if item is the first in the list */}
                        {index === 0 && 
                        <View style={[styles.settingItem1st, styles.settingItem]}>
                            <Text style={styles.settingText}>{item.key}: </Text>    
                            <Text style={styles.settingValue}>{item.value}</Text>
                        </View>}
                        
                        {/* Checks to see if item is in middle of the list */}
                        {(index !== 0) && 
                        <View style={[styles.settingItemMiddle, styles.settingItem]}>
                            <Text style={styles.settingText}>{item.key}: </Text>    
                            <Text style={styles.settingValue}>{item.value}</Text>
                        </View>
                        }
                        
                         {/* Checks to see if item is the last in the list */}
                        {index === settings[0].data.length-1 && 
                        <View style={[styles.settingItemLast, styles.settingItem]}>
                            <Text style={styles.settingText}>{item.key}: </Text>    
                            <Text style={styles.settingValue}>{item.value}</Text>
                        </View>
                        }
                      
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
        paddingTop: Platform.OS === "android" ? 50 : 0
      },
    settingsList: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        left: '5%',
        top: '10%',
        backgroundColor: '#112D4E',
        padding: 10,
        borderRadius: 10,
    },
    settingText: {
        color: 'white',
    },
    settingItem: {
        paddingLeft: 5,
        backgroundColor: '#376499',
        top: 1
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